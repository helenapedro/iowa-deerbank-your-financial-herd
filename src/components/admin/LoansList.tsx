import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Loader2, 
  RefreshCw, 
  List, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  XCircle,
  Eye
} from 'lucide-react';
import { loansApi } from '@/services/api';
import { LoanDTO } from '@/types/auth';
import { toast } from 'sonner';

interface LoansListProps {
  onSelectLoan: (loan: LoanDTO) => void;
}

const LoansList: React.FC<LoansListProps> = ({ onSelectLoan }) => {
  const [loans, setLoans] = useState<LoanDTO[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<LoanDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const response = await loansApi.getAll();
      // Handle both array response and wrapped response
      const loansList = Array.isArray(response) ? response : (response as any).data || [];
      setLoans(loansList);
      filterLoans(loansList, statusFilter);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch loans');
    } finally {
      setIsLoading(false);
    }
  };

  const filterLoans = (loansList: LoanDTO[], filter: string) => {
    if (filter === 'ALL') {
      setFilteredLoans(loansList);
    } else {
      setFilteredLoans(loansList.filter(loan => loan.status === filter));
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    filterLoans(loans, statusFilter);
  }, [statusFilter, loans]);

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

  // Count loans by status
  const statusCounts = loans.reduce((acc, loan) => {
    acc[loan.status] = (acc[loan.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <List size={20} />
              All Loans
            </CardTitle>
            <CardDescription>
              View and manage all loan applications
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLoans} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <RefreshCw size={16} />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Summary */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer" onClick={() => setStatusFilter('ALL')}>
            All: {loans.length}
          </Badge>
          <Badge 
            variant="secondary" 
            className={`cursor-pointer ${statusFilter === 'PENDING' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            <Clock size={12} className="mr-1" />
            Pending: {statusCounts['PENDING'] || 0}
          </Badge>
          <Badge 
            variant="default" 
            className={`cursor-pointer bg-amber-500 ${statusFilter === 'APPROVED' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setStatusFilter('APPROVED')}
          >
            <CheckCircle size={12} className="mr-1" />
            Approved: {statusCounts['APPROVED'] || 0}
          </Badge>
          <Badge 
            variant="default" 
            className={`cursor-pointer bg-green-600 ${statusFilter === 'ACTIVE' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setStatusFilter('ACTIVE')}
          >
            <TrendingUp size={12} className="mr-1" />
            Active: {statusCounts['ACTIVE'] || 0}
          </Badge>
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${statusFilter === 'CLOSED' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setStatusFilter('CLOSED')}
          >
            Closed: {statusCounts['CLOSED'] || 0}
          </Badge>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Loans</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loans Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No loans found with the selected filter.
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan No</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Principal</TableHead>
                  <TableHead className="text-right">Monthly</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan) => (
                  <TableRow key={loan.loanId} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{loan.loanNo}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{loan.userName}</div>
                        <div className="text-xs text-muted-foreground">{loan.accountNo}</div>
                      </div>
                    </TableCell>
                    <TableCell>{loan.loanType}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(loan.principalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(loan.monthlyPayment)}
                    </TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                    <TableCell className="text-sm">{formatDate(loan.applicationDate)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onSelectLoan(loan)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoansList;