import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/store/hooks';
import { loansApi } from '@/services/api';
import { LoanDTO } from '@/types/auth';
import { toast } from 'sonner';
import { Building, Calendar, DollarSign, Percent, Clock, FileText } from 'lucide-react';

interface LoansModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoansModal: React.FC<LoansModalProps> = ({ open, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [loans, setLoans] = useState<LoanDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user?.userId) {
      fetchLoans();
    }
  }, [open, user?.userId]);

  const fetchLoans = async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const response = await loansApi.getByUserId(user.userId);
      if (response.success && response.data) {
        setLoans(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error);
      toast.error('Failed to load loans');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-success/10 text-success';
      case 'PENDING':
        return 'bg-gold-muted text-foreground';
      case 'APPROVED':
        return 'bg-primary/10 text-primary';
      case 'DISBURSED':
        return 'bg-accent text-accent-foreground';
      case 'PAID':
        return 'bg-muted text-muted-foreground';
      case 'REJECTED':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building className="h-5 w-5 text-primary" />
            My Loans
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No loans found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Apply for a loan to see it here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <Card key={loan.loanId} className="border shadow-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">{loan.loanNo}</p>
                      <p className="font-semibold text-lg">{loan.loanType} Loan</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Principal</p>
                        <p className="font-semibold">{formatCurrency(loan.principalAmount)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{loan.interestRate}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Term</p>
                        <p className="font-semibold">{loan.loanTermMonths} months</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Monthly Payment</p>
                        <p className="font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="font-semibold">{formatCurrency(loan.remainingBalance)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Next Payment</p>
                        <p className="font-semibold">{formatDate(loan.nextPaymentDate)}</p>
                      </div>
                    </div>
                  </div>

                  {loan.purpose && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Purpose</p>
                          <p className="text-sm">{loan.purpose}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
