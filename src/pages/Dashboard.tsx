import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Header } from '@/components/dashboard/Header';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { TransferModal } from '@/components/modals/TransferModal';
import { AddPayeeModal } from '@/components/modals/AddPayeeModal';
import { accountsApi } from '@/services/api';
import { Transaction } from '@/types/auth';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [addPayeeModalOpen, setAddPayeeModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      setLoadingTransactions(true);
      try {
        const response = await accountsApi.getTransactions(
          user.accountNo,
          user.name,
          user.contactNo,
          true
        );
        
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

    if (user) {
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
            balance={user.balance}
            accountNo={user.accountNo}
            accountType={user.accountType}
            name={user.name}
          />
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in stagger-1" style={{ opacity: 0 }}>
          <QuickActions 
            onTransfer={() => setTransferModalOpen(true)}
            onAddPayee={() => setAddPayeeModalOpen(true)}
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
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Account Number</span>
                  <span className="font-mono">{user.accountNo}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Account Type</span>
                  <span>{user.accountType}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-success font-medium">{user.status}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Contact</span>
                  <span>{user.contactNo}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-right max-w-[200px] truncate">{user.address}</span>
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
    </div>
  );
};

export default Dashboard;
