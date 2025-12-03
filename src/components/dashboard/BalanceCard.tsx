import React from 'react';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface BalanceCardProps {
  balance: number;
  accountNo: string;
  accountType: string;
  name: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  balance, 
  accountNo, 
  accountType,
  name 
}) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="gradient-balance p-6 lg:p-8 text-primary-foreground border-0 shadow-glow overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-primary-foreground/5 translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-primary-foreground/70 text-sm mb-1">Welcome back,</p>
            <h2 className="text-xl font-display font-semibold">{name}</h2>
          </div>
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="mb-6">
          <p className="text-primary-foreground/70 text-sm mb-2">Available Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl lg:text-5xl font-bold tracking-tight">
              {showBalance ? formatBalance(balance) : '••••••'}
            </span>
            {balance > 0 && (
              <span className="flex items-center text-sm bg-primary-foreground/20 rounded-full px-2 py-0.5">
                <TrendingUp size={14} className="mr-1" />
                +2.4%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-primary-foreground/20">
          <div>
            <p className="text-primary-foreground/60 text-xs uppercase tracking-wider">Account Number</p>
            <p className="font-mono text-sm">{accountNo}</p>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/60 text-xs uppercase tracking-wider">Account Type</p>
            <p className="text-sm font-medium">{accountType}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
