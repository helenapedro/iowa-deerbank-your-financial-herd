import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Download, Receipt, UserPlus, Building, PlusCircle } from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

interface QuickActionsProps {
  onTransfer: () => void;
  onAddPayee: () => void;
  onPayBills: () => void;
  onLoans: () => void;
  onApplyLoan: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onTransfer, onAddPayee, onPayBills, onLoans, onApplyLoan }) => {
  const actions: QuickAction[] = [
    {
      icon: <Send size={24} />,
      label: 'Transfer',
      onClick: onTransfer,
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: <UserPlus size={24} />,
      label: 'Add Payee',
      onClick: onAddPayee,
      color: 'bg-secondary/20 text-secondary-foreground',
    },
    {
      icon: <Receipt size={24} />,
      label: 'Pay Bills',
      onClick: onPayBills,
      color: 'bg-gold-muted text-foreground',
    },
    {
      icon: <Building size={24} />,
      label: 'My Loans',
      onClick: onLoans,
      color: 'bg-muted text-muted-foreground',
    },
    {
      icon: <PlusCircle size={24} />,
      label: 'Apply Loan',
      onClick: onApplyLoan,
      color: 'bg-success/10 text-success',
    },
    {
      icon: <Download size={24} />,
      label: 'Deposit',
      onClick: () => {},
      color: 'bg-accent text-accent-foreground',
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-display font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <Card 
            key={index}
            className="border-0 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
            onClick={action.onClick}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
