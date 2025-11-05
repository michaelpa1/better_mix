import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface UsageTransaction {
  id: string;
  type: 'usage' | 'purchase' | 'bonus';
  description: string;
  amount: number;
  timestamp: string;
  service?: string;
  filename?: string;
}

interface UsageHistoryProps {
  transactions: UsageTransaction[];
}

const UsageHistory = ({ transactions }: UsageHistoryProps) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'usage':
        return 'MinusCircleIcon';
      case 'purchase':
        return 'PlusCircleIcon';
      case 'bonus':
        return 'GiftIcon';
      default:
        return 'CircleStackIcon';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'usage':
        return 'text-error';
      case 'purchase':
        return 'text-success';
      case 'bonus':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Usage History</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="ClockIcon" size={16} />
            <span>Last 30 days</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="DocumentTextIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No transactions yet</h4>
            <p className="text-muted-foreground">Your credit usage and purchase history will appear here.</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-muted/50 transition-smooth">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 ${getTransactionColor(transaction.type)}`}>
                    <Icon name={getTransactionIcon(transaction.type) as any} size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">
                        {transaction.description}
                      </h4>
                      {transaction.service && (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md">
                          {transaction.service}
                        </span>
                      )}
                    </div>
                    {transaction.filename && (
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        File: {transaction.filename}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`font-mono font-medium ${
                    transaction.type === 'usage' ? 'text-error' : 'text-success'
                  }`}>
                    {transaction.type === 'usage' ? '-' : '+'}
                    {Math.abs(transaction.amount).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">credits</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {transactions.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <button className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-smooth">
            View Complete History
          </button>
        </div>
      )}
    </div>
  );
};

export default UsageHistory;