import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/auth';
import { ArrowDownLeft, ArrowUpRight, Clock, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, isLoading }) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTransactionIcon = (type: string, isCredit: boolean) => {
    if (isCredit) {
      return (
        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
          <ArrowDownLeft className="text-success" size={20} />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
        <ArrowUpRight className="text-destructive" size={20} />
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • HH:mm');
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <RefreshCw className="animate-spin" size={20} />
            Loading Transactions...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
                <div className="h-5 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display">Recent Transactions</CardTitle>
        <button className="text-sm text-primary hover:underline">View All</button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock size={48} className="mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction, index) => {
              const isCredit = !!transaction.credit;
              return (
                <div 
                  key={`${transaction.tranId}-${index}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {getTransactionIcon(transaction.transferType, isCredit)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {transaction.description || transaction.transferType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.tranDatetime)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isCredit ? 'text-success' : 'text-destructive'}`}>
                      {isCredit ? '+' : '-'}{formatAmount(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {transaction.tranNo}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
