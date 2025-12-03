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
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateBalance } from '@/store/authSlice';
import { paymentsApi } from '@/services/api';
import { toast } from 'sonner';
import { Loader2, Send, CheckCircle } from 'lucide-react';

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ open, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<{ billNo: string; tranNo: string } | null>(null);
  
  const [form, setForm] = useState({
    payeeAccount: '',
    amount: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!form.payeeAccount.trim()) {
      toast.error('Please enter a payee account number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await paymentsApi.pay({
        customer_account: user.accountNo,
        payeeAccount: form.payeeAccount,
        payment_type: 'ONCE',
        amount,
        description: form.description || `Payment to ${form.payeeAccount}`,
      });

      if (response.success) {
        setSuccess(true);
        setResult({
          billNo: response.data.bill_payment_no,
          tranNo: response.data.tran_no,
        });
        dispatch(updateBalance(user.balance - amount));
        toast.success('Payment successful!');
      } else {
        toast.error(response.message || 'Payment failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ payeeAccount: '', amount: '', description: '' });
    setSuccess(false);
    setResult(null);
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
              <DialogTitle className="font-display text-2xl">Payment Successful!</DialogTitle>
              <DialogDescription>
                Your transfer has been processed successfully.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Bill Number</span>
                <span className="font-mono">{result?.billNo}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Transaction No</span>
                <span className="font-mono">{result?.tranNo}</span>
              </div>
            </div>
            <Button onClick={handleClose} variant="hero" className="w-full mt-6">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Make a Transfer</DialogTitle>
              <DialogDescription>
                Send money to another account instantly.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="payee-account">Recipient Account Number</Label>
                <Input
                  id="payee-account"
                  placeholder="ACC40156872"
                  value={form.payeeAccount}
                  onChange={(e) => setForm({ ...form, payeeAccount: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Available: ${Number(user?.balance ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Payment for..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  disabled={isLoading}
                  rows={3}
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Money
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
