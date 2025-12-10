import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UserPlus, CheckCircle } from 'lucide-react';
import { accountsApi } from '@/services/api';
import { toast } from 'sonner';
import { AccountResponse } from '@/types/auth';

const CreateAccountForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<AccountResponse | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    contactNo: '',
    ssn: '',
    accountType: 'SAVINGS' as 'SAVINGS' | 'CHECKING' | 'BUSINESS',
    initialBalance: '',
    interestRate: '',
    overdraftLimit: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dob || !formData.address || !formData.contactNo || !formData.ssn) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await accountsApi.create({
        name: formData.name,
        dob: formData.dob,
        address: formData.address,
        contactNo: formData.contactNo,
        ssn: formData.ssn,
        createdBy: 'admin',
        accountType: formData.accountType,
        initialBalance: parseFloat(formData.initialBalance) || 0,
        accountCreatedBy: 1, // Admin ID
        interestRate: parseFloat(formData.interestRate) || undefined,
        overdraftLimit: parseFloat(formData.overdraftLimit) || undefined,
      });

      if (response.success && response.data) {
        toast.success('Account created successfully!');
        setCreatedAccount(response.data);
        // Reset form
        setFormData({
          name: '',
          dob: '',
          address: '',
          contactNo: '',
          ssn: '',
          accountType: 'SAVINGS',
          initialBalance: '',
          interestRate: '',
          overdraftLimit: '',
        });
      } else {
        toast.error(response.message || 'Failed to create account');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus size={20} />
            Create New Account
          </CardTitle>
          <CardDescription>
            Create a new customer account with user profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street, New York, NY 10001"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNo">Contact Number *</Label>
                  <Input
                    id="contactNo"
                    placeholder="+1-555-0123"
                    value={formData.contactNo}
                    onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ssn">SSN *</Label>
                  <Input
                    id="ssn"
                    placeholder="123-45-6789"
                    value={formData.ssn}
                    onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Account Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(value: 'SAVINGS' | 'CHECKING' | 'BUSINESS') => 
                      setFormData({ ...formData, accountType: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAVINGS">Savings</SelectItem>
                      <SelectItem value="CHECKING">Checking</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialBalance">Initial Balance ($)</Label>
                  <Input
                    id="initialBalance"
                    type="number"
                    step="0.01"
                    placeholder="500.00"
                    value={formData.initialBalance}
                    onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="3"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overdraftLimit">Overdraft Limit ($)</Label>
                  <Input
                    id="overdraftLimit"
                    type="number"
                    step="0.01"
                    placeholder="500"
                    value={formData.overdraftLimit}
                    onChange={(e) => setFormData({ ...formData, overdraftLimit: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={16} className="mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Created Account Details */}
      {createdAccount && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              Account Created Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Account Number</span>
                <p className="font-mono font-bold text-lg">{createdAccount.accountNo}</p>
              </div>
              <div>
                <span className="text-muted-foreground">User ID</span>
                <p className="font-bold">{createdAccount.userId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Customer Name</span>
                <p className="font-medium">{createdAccount.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Account Type</span>
                <p className="font-medium">{createdAccount.accountType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Initial Balance</span>
                <p className="font-medium">{formatCurrency(createdAccount.balance)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status</span>
                <p className="font-medium">{createdAccount.status}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              The customer can now register using the account number: <span className="font-mono font-bold">{createdAccount.accountNo}</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateAccountForm;