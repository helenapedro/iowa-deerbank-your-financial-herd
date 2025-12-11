import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { Header } from '@/components/dashboard/Header';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { TransferModal } from '@/components/modals/TransferModal';
import { AddPayeeModal } from '@/components/modals/AddPayeeModal';
import { LoansModal } from '@/components/modals/LoansModal';
import { ApplyLoanModal } from '@/components/modals/ApplyLoanModal';
import { DepositModal } from '@/components/modals/DepositModal';
import { accountsApi } from '@/services/api';
import { Transaction } from '@/types/auth';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // Redirect MASTER users to admin dashboard
  useEffect(() => {
    if (user?.userType === 'MASTER') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [addPayeeModalOpen, setAddPayeeModalOpen] = useState(false);
  const [loansModalOpen, setLoansModalOpen] = useState(false);
  const [applyLoanModalOpen, setApplyLoanModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  const fetchTransactions = async () => {
    if (!user || !user.accountNo) return;
    
    setLoadingTransactions(true);
    try {
      const response = await accountsApi.getTransactions({
        accountNo: user.accountNo,
        name: user.name || undefined,
        contactNo: user.contactNo || undefined,
        isMasterUser: user.userType === 'MASTER'
      });
      
      if (response.success) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (user && user.accountNo) {
      fetchTransactions();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 lg:py-8 space-y-8">
        {/* Balance Section */}
        <div className="animate-fade-in">
          <BalanceCard
            balance={user.balance ?? 0}
            accountNo={user.accountNo ?? 'N/A'}
            accountType={user.accountType ?? 'N/A'}
            name={user.name ?? 'User'}
          />
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
          <QuickActions 
            onTransfer={() => setTransferModalOpen(true)}
            onAddPayee={() => setAddPayeeModalOpen(true)}
            onPayBills={() => setTransferModalOpen(true)}
            onLoans={() => setLoansModalOpen(true)}
            onApplyLoan={() => setApplyLoanModalOpen(true)}
            onDeposit={() => setDepositModalOpen(true)}
          />
        </div>

        {/* Transactions */}
        <div className="animate-fade-in stagger-2" style={{ opacity: 0 }}>
          <TransactionList 
            transactions={transactions}
            isLoading={loadingTransactions}
          />
        </div>

        {/* Account Info Card */}
        <div className="animate-fade-in stagger-3" style={{ opacity: 0 }}>
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="text-lg font-display font-semibold mb-4">Account Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Account Holder</span>
                  <span className="font-medium">{user.name ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Account Number</span>
                  <span className="font-mono">{user.accountNo ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Account Type</span>
                  <span>{user.accountType ?? 'N/A'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-success font-medium">{user.status}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Contact</span>
                  <span>{user.contactNo ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-right max-w-[200px] truncate">{user.address ?? 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <TransferModal 
        open={transferModalOpen} 
        onClose={() => setTransferModalOpen(false)} 
      />
      <AddPayeeModal 
        open={addPayeeModalOpen} 
        onClose={() => setAddPayeeModalOpen(false)} 
      />
      <LoansModal
        open={loansModalOpen}
        onClose={() => setLoansModalOpen(false)}
      />
      <ApplyLoanModal
        open={applyLoanModalOpen}
        onClose={() => setApplyLoanModalOpen(false)}
        onSuccess={() => {}}
      />
      <DepositModal
        open={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  );
};

export default Dashboard;
