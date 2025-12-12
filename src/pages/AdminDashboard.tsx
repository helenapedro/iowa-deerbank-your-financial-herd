import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  TrendingUp,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  UserPlus,
  List
} from 'lucide-react';
import { loansApi } from '@/services/api';
import { LoanDTO } from '@/types/auth';
import { toast } from 'sonner';
import CreateAccountForm from '@/components/admin/CreateAccountForm';
import LoansList from '@/components/admin/LoansList';

const AdminDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [loanSearchInput, setLoanSearchInput] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'number'>('id');
  const [currentLoan, setCurrentLoan] = useState<LoanDTO | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearchLoan = async () => {
    const searchValue = loanSearchInput.trim();
    
    if (!searchValue) {
      toast.error('Please enter a search value');
      return;
    }

    setIsSearching(true);
    setCurrentLoan(null);
    
    try {
      let loan: LoanDTO;
      
      if (searchType === 'id') {
        const loanId = parseInt(searchValue);
        if (isNaN(loanId) || loanId <= 0) {
          toast.error('Please enter a valid Loan ID');
          setIsSearching(false);
          return;
        }
        loan = await loansApi.getById(loanId);
      } else {
        // Search by loan number (e.g., LN-5658207766)
        loan = await loansApi.getByLoanNumber(searchValue);
      }
      
      setCurrentLoan(loan);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Loan not found');
    } finally {
      setIsSearching(false);
    }
  };

  const handleApproveLoan = async () => {
    if (!currentLoan) return;
    
    setIsProcessing(true);
    try {
      const loan = await loansApi.approve(currentLoan.loanId, 1);
      toast.success('Loan approved successfully');
      setCurrentLoan(loan);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve loan');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisburseLoan = async () => {
    if (!currentLoan) return;
    
    setIsProcessing(true);
    try {
      const loan = await loansApi.disburse(currentLoan.loanId, 1);
      toast.success('Loan disbursed successfully');
      setCurrentLoan(loan);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to disburse loan');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode; className?: string }> = {
      PENDING: { variant: 'secondary', icon: <Clock size={12} /> },
      APPROVED: { variant: 'default', icon: <CheckCircle size={12} />, className: 'bg-amber-500' },
      ACTIVE: { variant: 'default', icon: <TrendingUp size={12} />, className: 'bg-green-600' },
      REJECTED: { variant: 'destructive', icon: <XCircle size={12} /> },
      CLOSED: { variant: 'outline', icon: <CheckCircle size={12} /> },
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
      <Badge variant={config.variant} className={`gap-1 ${config.className || ''}`}>
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

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all-loans" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="all-loans" className="flex items-center gap-2">
              <List size={16} />
              All Loans
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search size={16} />
              Search Loan
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <UserPlus size={16} />
              Create Account
            </TabsTrigger>
          </TabsList>

          {/* All Loans Tab */}
          <TabsContent value="all-loans" className="space-y-6">
            <LoansList onSelectLoan={(loan) => setCurrentLoan(loan)} />
            
            {/* Selected Loan Details */}
            {currentLoan && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        Loan {currentLoan.loanNo}
                        {getStatusBadge(currentLoan.status)}
                      </CardTitle>
                      <CardDescription>
                        {currentLoan.loanType} Loan • Applied on {formatDate(currentLoan.applicationDate)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setCurrentLoan(null)}>
                        Close
                      </Button>
                      {currentLoan.status === 'PENDING' && (
                        <Button onClick={handleApproveLoan} disabled={isProcessing}>
                          {isProcessing ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          ) : (
                            <CheckCircle size={16} className="mr-2" />
                          )}
                          Approve Loan
                        </Button>
                      )}
                      {currentLoan.status === 'APPROVED' && (
                        <Button onClick={handleDisburseLoan} disabled={isProcessing} variant="outline">
                          {isProcessing ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          ) : (
                            <DollarSign size={16} className="mr-2" />
                          )}
                          Disburse Loan
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Loan Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Principal Amount</div>
                      <div className="text-xl font-bold">{formatCurrency(currentLoan.principalAmount)}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Interest Rate</div>
                      <div className="text-xl font-bold">{currentLoan.interestRate}%</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Monthly Payment</div>
                      <div className="text-xl font-bold">{formatCurrency(currentLoan.monthlyPayment)}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Remaining Balance</div>
                      <div className="text-xl font-bold">{formatCurrency(currentLoan.remainingBalance)}</div>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Borrower Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <User size={16} />
                        Borrower Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name</span>
                          <span className="font-medium">{currentLoan.userName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">User ID</span>
                          <span className="font-medium">{currentLoan.userId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account No</span>
                          <span className="font-medium font-mono">{currentLoan.accountNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account ID</span>
                          <span className="font-medium">{currentLoan.accountId}</span>
                        </div>
                      </div>
                    </div>

                    {/* Loan Dates */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Calendar size={16} />
                        Important Dates
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Application Date</span>
                          <span className="font-medium">{formatDate(currentLoan.applicationDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Approval Date</span>
                          <span className="font-medium">{formatDate(currentLoan.approvalDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Disbursement Date</span>
                          <span className="font-medium">{formatDate(currentLoan.disbursementDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Maturity Date</span>
                          <span className="font-medium">{formatDate(currentLoan.maturityDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next Payment</span>
                          <span className="font-medium">{formatDate(currentLoan.nextPaymentDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Loan Terms */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard size={16} />
                        Loan Terms
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Loan Term</span>
                          <span className="font-medium">{currentLoan.loanTermMonths} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payments Made</span>
                          <span className="font-medium">{currentLoan.totalPaymentsMade || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Late Payments</span>
                          <span className="font-medium">{currentLoan.latePaymentCount || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Purpose & Collateral */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Purpose & Collateral</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground block mb-1">Purpose</span>
                          <span className="font-medium">{currentLoan.purpose || '-'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-1">Collateral</span>
                          <span className="font-medium">{currentLoan.collateral || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Search Loan Tab */}
          <TabsContent value="search" className="space-y-6">
            {/* Loan Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search size={20} />
                  Search Loan
                </CardTitle>
                <CardDescription>
                  Search by Loan ID or Loan Number to view details and manage the loan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <Button
                      variant={searchType === 'id' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSearchType('id')}
                    >
                      By Loan ID
                    </Button>
                    <Button
                      variant={searchType === 'number' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSearchType('number')}
                    >
                      By Loan Number
                    </Button>
                  </div>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 max-w-md">
                      <Label htmlFor="loanSearch">
                        {searchType === 'id' ? 'Loan ID' : 'Loan Number'}
                      </Label>
                      <Input
                        id="loanSearch"
                        type={searchType === 'id' ? 'number' : 'text'}
                        placeholder={searchType === 'id' ? 'Enter loan ID (e.g., 1)' : 'Enter loan number (e.g., LN-5658207766)'}
                        value={loanSearchInput}
                        onChange={(e) => setLoanSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchLoan()}
                      />
                    </div>
                    <Button onClick={handleSearchLoan} disabled={isSearching}>
                      {isSearching ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      ) : (
                        <Search size={16} className="mr-2" />
                      )}
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Details */}
            {currentLoan && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        Loan {currentLoan.loanNo}
                        {getStatusBadge(currentLoan.status)}
                      </CardTitle>
                      <CardDescription>
                        {currentLoan.loanType} Loan • Applied on {formatDate(currentLoan.applicationDate)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {currentLoan.status === 'PENDING' && (
                        <Button onClick={handleApproveLoan} disabled={isProcessing}>
                          {isProcessing ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          ) : (
                            <CheckCircle size={16} className="mr-2" />
                          )}
                          Approve Loan
                        </Button>
                      )}
                      {currentLoan.status === 'APPROVED' && (
                        <Button onClick={handleDisburseLoan} disabled={isProcessing} variant="outline">
                          {isProcessing ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          ) : (
                            <DollarSign size={16} className="mr-2" />
                          )}
                          Disburse Loan
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Loan Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Principal Amount</div>
                      <div className="text-xl font-bold">{formatCurrency(currentLoan.principalAmount)}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Interest Rate</div>
                      <div className="text-xl font-bold">{currentLoan.interestRate}%</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Monthly Payment</div>
                      <div className="text-xl font-bold">{formatCurrency(currentLoan.monthlyPayment)}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Remaining Balance</div>
                      <div className="text-xl font-bold">{formatCurrency(currentLoan.remainingBalance)}</div>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Borrower Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <User size={16} />
                        Borrower Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name</span>
                          <span className="font-medium">{currentLoan.userName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">User ID</span>
                          <span className="font-medium">{currentLoan.userId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account No</span>
                          <span className="font-medium font-mono">{currentLoan.accountNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account ID</span>
                          <span className="font-medium">{currentLoan.accountId}</span>
                        </div>
                      </div>
                    </div>

                    {/* Loan Dates */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Calendar size={16} />
                        Important Dates
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Application Date</span>
                          <span className="font-medium">{formatDate(currentLoan.applicationDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Approval Date</span>
                          <span className="font-medium">{formatDate(currentLoan.approvalDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Disbursement Date</span>
                          <span className="font-medium">{formatDate(currentLoan.disbursementDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Maturity Date</span>
                          <span className="font-medium">{formatDate(currentLoan.maturityDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next Payment</span>
                          <span className="font-medium">{formatDate(currentLoan.nextPaymentDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Loan Terms */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard size={16} />
                        Loan Terms
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Loan Term</span>
                          <span className="font-medium">{currentLoan.loanTermMonths} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payments Made</span>
                          <span className="font-medium">{currentLoan.totalPaymentsMade || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Late Payments</span>
                          <span className="font-medium">{currentLoan.latePaymentCount || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Purpose & Collateral */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Purpose & Collateral</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground block mb-1">Purpose</span>
                          <span className="font-medium">{currentLoan.purpose || '-'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-1">Collateral</span>
                          <span className="font-medium">{currentLoan.collateral || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!currentLoan && !isSearching && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Search for a Loan</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Enter a Loan ID or Loan Number above to view loan details, approve pending applications, or disburse approved loans.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Create Account Tab */}
          <TabsContent value="accounts">
            <CreateAccountForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;