import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface CreditBalanceDisplayProps {
  balance: number;
  isLoading?: boolean;
}

const CreditBalanceDisplay = ({ balance, isLoading = false }: CreditBalanceDisplayProps) => {
  const formatBalance = (amount: number): string => {
    return amount.toLocaleString('en-US');
  };

  const getBalanceStatus = (amount: number): { color: string; message: string } => {
    if (amount >= 1000) {
      return { color: 'text-success', message: 'Excellent balance' };
    } else if (amount >= 100) {
      return { color: 'text-warning', message: 'Good balance' };
    } else if (amount >= 25) {
      return { color: 'text-warning', message: 'Low balance' };
    } else {
      return { color: 'text-destructive', message: 'Very low balance' };
    }
  };

  const status = getBalanceStatus(balance);

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-muted rounded-lg" />
            <div className="h-4 bg-muted rounded w-24" />
          </div>
          <div className="h-8 bg-muted rounded w-32 mb-2" />
          <div className="h-3 bg-muted rounded w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="CurrencyDollarIcon" size={20} className="text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Credit Balance</h3>
      </div>

      {/* Balance Amount */}
      <div className="mb-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold font-mono text-foreground">
            {formatBalance(balance)}
          </span>
          <span className="text-sm text-muted-foreground">credits</span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${
          balance >= 100 ? 'bg-success' : balance >= 25 ? 'bg-warning' : 'bg-destructive'
        }`} />
        <span className={`text-sm font-medium ${status.color}`}>
          {status.message}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth text-sm font-medium">
          <Icon name="PlusIcon" size={16} />
          <span>Add Credits</span>
        </button>
        
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-smooth text-sm font-medium">
          <Icon name="DocumentTextIcon" size={16} />
          <span>View History</span>
        </button>
      </div>

      {/* Low Balance Warning */}
      {balance < 50 && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="ExclamationTriangleIcon" size={16} className="text-warning mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-warning mb-1">Low Credit Balance</p>
              <p className="text-warning/80">
                Consider adding more credits to continue processing files without interruption.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditBalanceDisplay;