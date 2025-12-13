import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/store/hooks';
import { payeesApi } from '@/services/api';
import { toast } from 'sonner';
import { Loader2, UserPlus, CheckCircle } from 'lucide-react';

interface AddPayeeModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddPayeeModal: React.FC<AddPayeeModalProps> = ({ open, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    email: '',
    phone: '',
    accountNo: '',
    customeraccount: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!form.name || !form.accountNo !! !form.customeraccount) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await payeesApi.create({
        name: form.name,
        nickname: form.nickname || form.name,
        email: form.email,
        phone: form.phone,
        accountNo: form.accountNo,
        userId: user.userId,
      });

      if (response.success) {
        setSuccess(true);
        toast.success('Payee added successfully!');
      } else {
        toast.error(response.message || 'Failed to add payee');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add payee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', nickname: '', email: '', phone: '', accountNo: '' });
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-success" size={40} />
            </div>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Payee Added!</DialogTitle>
              <DialogDescription>
                {form.name} has been added to your payees.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={handleClose} variant="hero" className="w-full mt-6">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Add New Payee</DialogTitle>
              <DialogDescription>
                Save a recipient for quick transfers.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payee-name">Full Name *</Label>
                  <Input
                    id="payee-name"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payee-nickname">Nickname</Label>
                  <Input
                    id="payee-nickname"
                    placeholder="jnd123"
                    value={form.nickname}
                    onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payee-account">Account Number *</Label>
                <Input
                  id="payee-account"
                  placeholder="ACC40156872"
                  value={form.accountNo}
                  onChange={(e) => setForm({ ...form, accountNo: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-account">Customer Account *</Label>
                <Input
                  id="customer-account"
                  placeholder="ACC9926931465"
                  value={form.customeraccount}
                  onChange={(e) => setForm({ ...form, customeraccount: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payee-email">Email</Label>
                <Input
                  id="payee-email"
                  type="email"
                  placeholder="jane@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payee-phone">Phone</Label>
                <Input
                  id="payee-phone"
                  placeholder="+1-555-0123"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Add Payee
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
