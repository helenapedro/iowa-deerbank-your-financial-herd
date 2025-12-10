import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Loader2
} from 'lucide-react';
import { loansApi } from '@/services/api';
import { LoanDTO } from '@/types/auth';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [pendingLoans, setPendingLoans] = useState<LoanDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingLoanId, setProcessingLoanId] = useState<number | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const fetchPendingLoans = async () => {
    setIsLoading(true);
    try {
      // For now, we'll fetch all loans and filter pending ones
      // In a real scenario, backend might have an endpoint for pending loans
      const response = await loansApi.getByUserId(0); // Get all loans
      if (response.success) {
        const pending = response.data.filter(loan => loan.status === 'PENDING');
        setPendingLoans(pending);
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error);
      // Don't show error toast as this endpoint might not exist yet
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const handleApproveLoan = async (loanId: number) => {
    if (!user) return;
    
    setProcessingLoanId(loanId);
    try {
      const response = await loansApi.approve(loanId, user.credentialId);
      if (response.success) {
        toast.success('Loan approved successfully');
        fetchPendingLoans();
      } else {
        toast.error(response.message || 'Failed to approve loan');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve loan');
    } finally {
      setProcessingLoanId(null);
    }
  };

  const handleDisburseLoan = async (loanId: number) => {
    if (!user) return;
    
    setProcessingLoanId(loanId);
    try {
      const response = await loansApi.disburse(loanId, user.credentialId);
      if (response.success) {
        toast.success('Loan disbursed successfully');
        fetchPendingLoans();
      } else {
        toast.error(response.message || 'Failed to disburse loan');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to disburse loan');
    } finally {
      setProcessingLoanId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      PENDING: { variant: 'secondary', icon: <Clock size={12} /> },
      APPROVED: { variant: 'default', icon: <CheckCircle size={12} /> },
      ACTIVE: { variant: 'default', icon: <TrendingUp size={12} /> },
      REJECTED: { variant: 'destructive', icon: <XCircle size={12} /> },
      CLOSED: { variant: 'outline', icon: <CheckCircle size={12} /> },
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <Badge variant="destructive" className="font-semibold">
              ADMIN
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user?.username}</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Loans
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLoans.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Loans
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Accounts
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Loan Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Pending Loan Requests
            </CardTitle>
            <CardDescription>
              Review and approve or reject loan applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
              </div>
            ) : pendingLoans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending loan requests
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan No</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingLoans.map((loan) => (
                      <TableRow key={loan.loanId}>
                        <TableCell className="font-mono text-sm">
                          {loan.loanNo}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{loan.userName}</div>
                            <div className="text-xs text-muted-foreground">
                              {loan.accountNo}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{loan.loanType}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(loan.principalAmount)}
                        </TableCell>
                        <TableCell>{loan.loanTermMonths} months</TableCell>
                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {loan.status === 'PENDING' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleApproveLoan(loan.loanId)}
                                disabled={processingLoanId === loan.loanId}
                              >
                                {processingLoanId === loan.loanId ? (
                                  <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                  'Approve'
                                )}
                              </Button>
                            )}
                            {loan.status === 'APPROVED' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDisburseLoan(loan.loanId)}
                                disabled={processingLoanId === loan.loanId}
                              >
                                {processingLoanId === loan.loanId ? (
                                  <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                  'Disburse'
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
