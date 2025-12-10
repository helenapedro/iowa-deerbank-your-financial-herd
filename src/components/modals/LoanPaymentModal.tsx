import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/store/hooks';
import { loanPaymentsApi } from '@/services/api';
import { LoanDTO } from '@/types/auth';
import { toast } from 'sonner';
import { DollarSign, CreditCard, FileText } from 'lucide-react';

interface LoanPaymentModalProps {
  open: boolean;
  onClose: () => void;
  loan: LoanDTO | null;
  onSuccess?: () => void;
}

export const LoanPaymentModal: React.FC<LoanPaymentModalProps> = ({ open, onClose, loan, onSuccess }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(loan?.monthlyPayment || 0);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (loan) {
      setPaymentAmount(loan.monthlyPayment);
    }
  }, [loan]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loan || !user?.accountNo) {
      toast.error('Missing loan or account information');
      return;
    }

    if (paymentAmount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    setLoading(true);
    try {
      const response = await loanPaymentsApi.pay({
        loanId: loan.loanId,
        accountNumber: user.accountNo,
        paymentAmount,
        paymentMethod: 'ACCOUNT_DEBIT',
        notes: notes || undefined,
      });

      if (response.success) {
        toast.success(`Payment successful! Payment No: ${response.data.paymentNo}`);
        onSuccess?.();
        onClose();
        setNotes('');
      } else {
        toast.error(response.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Loan payment error:', error);
      // Handle backend error response format: { error: "...", status: "error" }
      const errorMessage = error?.response?.error || error?.message || 'Failed to process payment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!loan) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="h-5 w-5 text-primary" />
            Make Loan Payment
          </DialogTitle>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Loan</span>
            <span className="font-mono text-sm">{loan.loanNo}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Type</span>
            <span className="text-sm">{loan.loanType}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Monthly Payment</span>
            <span className="font-semibold">{formatCurrency(loan.monthlyPayment)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Remaining Balance</span>
            <span className="font-semibold text-primary">{formatCurrency(loan.remainingBalance)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentAmount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payment Amount
            </Label>
            <Input
              id="paymentAmount"
              type="number"
              min="0.01"
              step="0.01"
              value={paymentAmount || ''}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Suggested: {formatCurrency(loan.monthlyPayment)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add a note for this payment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Processing...' : `Pay ${formatCurrency(paymentAmount)}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};