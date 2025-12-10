import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/store/hooks';
import { loansApi, loanPaymentsApi } from '@/services/api';
import { LoanDTO, LoanPaymentDTO } from '@/types/auth';
import { toast } from 'sonner';
import { Building, Calendar, DollarSign, Percent, Clock, FileText, CreditCard, History, ChevronDown, ChevronUp } from 'lucide-react';
import { LoanPaymentModal } from './LoanPaymentModal';

interface LoansModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoansModal: React.FC<LoansModalProps> = ({ open, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [loans, setLoans] = useState<LoanDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanDTO | null>(null);
  const [expandedLoan, setExpandedLoan] = useState<number | null>(null);
  const [payments, setPayments] = useState<Record<number, LoanPaymentDTO[]>>({});
  const [loadingPayments, setLoadingPayments] = useState<number | null>(null);

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

  const fetchPaymentHistory = async (loanId: number) => {
    if (payments[loanId]) {
      setExpandedLoan(expandedLoan === loanId ? null : loanId);
      return;
    }

    setLoadingPayments(loanId);
    try {
      const response = await loanPaymentsApi.getByLoanId(loanId);
      if (response.success && response.data) {
        setPayments(prev => ({ ...prev, [loanId]: response.data }));
        setExpandedLoan(loanId);
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoadingPayments(null);
    }
  };

  const handleMakePayment = (loan: LoanDTO) => {
    setSelectedLoan(loan);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    fetchLoans();
    // Refresh payment history if expanded
    if (selectedLoan && expandedLoan === selectedLoan.loanId) {
      setPayments(prev => {
        const newPayments = { ...prev };
        delete newPayments[selectedLoan.loanId];
        return newPayments;
      });
      fetchPaymentHistory(selectedLoan.loanId);
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

                  {/* Actions for ACTIVE loans */}
                  {loan.status === 'ACTIVE' && (
                    <div className="mt-4 pt-4 border-t border-border flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleMakePayment(loan)}
                        className="flex items-center gap-1"
                      >
                        <CreditCard className="h-4 w-4" />
                        Make Payment
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => fetchPaymentHistory(loan.loanId)}
                        className="flex items-center gap-1"
                      >
                        {loadingPayments === loan.loanId ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                          <>
                            <History className="h-4 w-4" />
                            Payment History
                            {expandedLoan === loan.loanId ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Payment History */}
                  {expandedLoan === loan.loanId && payments[loan.loanId] && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <History className="h-4 w-4" />
                        Payment History ({payments[loan.loanId].length} payments)
                      </p>
                      {payments[loan.loanId].length === 0 ? (
                        <p className="text-sm text-muted-foreground">No payments made yet</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {payments[loan.loanId].map((payment) => (
                            <div key={payment.paymentId} className="bg-muted/50 rounded p-3 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-xs">{payment.paymentNo}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  payment.paymentStatus === 'COMPLETED' ? 'bg-success/10 text-success' :
                                  payment.paymentStatus === 'LATE' ? 'bg-gold-muted text-foreground' :
                                  'bg-muted text-muted-foreground'
                                }`}>
                                  {payment.paymentStatus}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-muted-foreground">{formatDate(payment.paymentDate)}</span>
                                <span className="font-semibold">{formatCurrency(payment.paymentAmount)}</span>
                              </div>
                              {payment.lateFee > 0 && (
                                <p className="text-xs text-destructive mt-1">Late fee: {formatCurrency(payment.lateFee)}</p>
                              )}
                              {payment.notes && (
                                <p className="text-xs text-muted-foreground mt-1">{payment.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
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

      <LoanPaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        loan={selectedLoan}
        onSuccess={handlePaymentSuccess}
      />
    </Dialog>
  );
};
