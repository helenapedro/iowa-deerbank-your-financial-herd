import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/store/hooks';
import { loansApi } from '@/services/api';
import { LoanRequestDTO } from '@/types/auth';
import { toast } from 'sonner';
import { Building, DollarSign, Percent, Clock, FileText, Shield } from 'lucide-react';

interface ApplyLoanModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LOAN_TYPES = [
  { value: 'PERSONAL', label: 'Personal Loan', defaultRate: 10.5 },
  { value: 'HOME', label: 'Home Loan', defaultRate: 6.5 },
  { value: 'AUTO', label: 'Auto Loan', defaultRate: 7.25 },
  { value: 'BUSINESS', label: 'Business Loan', defaultRate: 9.0 },
  { value: 'EDUCATION', label: 'Education Loan', defaultRate: 5.5 },
] as const;

const TERM_OPTIONS = [
  { value: 12, label: '12 months (1 year)' },
  { value: 24, label: '24 months (2 years)' },
  { value: 36, label: '36 months (3 years)' },
  { value: 48, label: '48 months (4 years)' },
  { value: 60, label: '60 months (5 years)' },
  { value: 120, label: '120 months (10 years)' },
  { value: 180, label: '180 months (15 years)' },
  { value: 360, label: '360 months (30 years)' },
];

export const ApplyLoanModal: React.FC<ApplyLoanModalProps> = ({ open, onClose, onSuccess }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoanRequestDTO>({
    accountNumber: user?.accountNo || '',
    loanType: 'PERSONAL',
    principalAmount: 0,
    interestRate: 10.5,
    loanTermMonths: 36,
    purpose: '',
    collateral: '',
  });

  const handleLoanTypeChange = (value: string) => {
    const loanType = LOAN_TYPES.find(t => t.value === value);
    setFormData(prev => ({
      ...prev,
      loanType: value as LoanRequestDTO['loanType'],
      interestRate: loanType?.defaultRate || prev.interestRate,
    }));
  };

  const calculateMonthlyPayment = () => {
    const { principalAmount, interestRate, loanTermMonths } = formData;
    if (!principalAmount || !interestRate || !loanTermMonths) return 0;
    
    const monthlyRate = interestRate / 100 / 12;
    const payment = principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / 
                   (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
    return isNaN(payment) ? 0 : payment;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.accountNo) {
      toast.error('Account information not available');
      return;
    }

    if (formData.principalAmount <= 0) {
      toast.error('Please enter a valid loan amount');
      return;
    }

    if (!formData.purpose.trim()) {
      toast.error('Please provide a purpose for the loan');
      return;
    }

    setLoading(true);
    try {
      const response = await loansApi.apply({
        ...formData,
        accountNumber: user.accountNo,
      });

      if (response.success) {
        toast.success(`Loan application submitted! Loan No: ${response.data.loanNo}`);
        onSuccess?.();
        onClose();
        // Reset form
        setFormData({
          accountNumber: user.accountNo,
          loanType: 'PERSONAL',
          principalAmount: 0,
          interestRate: 10.5,
          loanTermMonths: 36,
          purpose: '',
          collateral: '',
        });
      } else {
        toast.error(response.message || 'Failed to submit loan application');
      }
    } catch (error) {
      console.error('Loan application error:', error);
      toast.error('Failed to submit loan application');
    } finally {
      setLoading(false);
    }
  };

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building className="h-5 w-5 text-primary" />
            Apply for a Loan
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loan Type */}
          <div className="space-y-2">
            <Label htmlFor="loanType" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Loan Type
            </Label>
            <Select value={formData.loanType} onValueChange={handleLoanTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                {LOAN_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label} ({type.defaultRate}% APR)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Principal Amount */}
          <div className="space-y-2">
            <Label htmlFor="principalAmount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Loan Amount
            </Label>
            <Input
              id="principalAmount"
              type="number"
              min="1000"
              step="100"
              placeholder="Enter loan amount"
              value={formData.principalAmount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, principalAmount: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <Label htmlFor="interestRate" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Interest Rate (% APR)
            </Label>
            <Input
              id="interestRate"
              type="number"
              min="0.1"
              step="0.1"
              value={formData.interestRate}
              onChange={(e) => setFormData(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>

          {/* Loan Term */}
          <div className="space-y-2">
            <Label htmlFor="loanTermMonths" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Loan Term
            </Label>
            <Select 
              value={formData.loanTermMonths.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, loanTermMonths: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select loan term" />
              </SelectTrigger>
              <SelectContent>
                {TERM_OPTIONS.map((term) => (
                  <SelectItem key={term.value} value={term.value.toString()}>
                    {term.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Monthly Payment Estimate */}
          {monthlyPayment > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(monthlyPayment)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Total payable: {formatCurrency(monthlyPayment * formData.loanTermMonths)}
              </p>
            </div>
          )}

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Purpose
            </Label>
            <Textarea
              id="purpose"
              placeholder="Describe the purpose of this loan..."
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              rows={3}
              required
            />
          </div>

          {/* Collateral */}
          <div className="space-y-2">
            <Label htmlFor="collateral" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Collateral (Optional)
            </Label>
            <Textarea
              id="collateral"
              placeholder="Describe any collateral for this loan..."
              value={formData.collateral}
              onChange={(e) => setFormData(prev => ({ ...prev, collateral: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};