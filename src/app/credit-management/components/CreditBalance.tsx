import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface CreditBalanceProps {
  currentBalance: number;
  recentUsage: number;
  projectedNeeds: number;
}

const CreditBalance = ({ currentBalance, recentUsage, projectedNeeds }: CreditBalanceProps) => {
  const balanceStatus = currentBalance < projectedNeeds ? 'low' : currentBalance < projectedNeeds * 2 ? 'medium' : 'high';
  
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Credit Balance</h2>
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
          balanceStatus === 'low' ? 'bg-error/10 text-error' :
          balanceStatus === 'medium'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
        }`}>
          <Icon 
            name={balanceStatus === 'low' ? 'ExclamationTriangleIcon' : 'CheckCircleIcon'} 
            size={16} 
          />
          <span className="text-sm font-medium capitalize">{balanceStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Balance */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <Icon name="CurrencyDollarIcon" size={20} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Current Balance</span>
          </div>
          <div className="text-3xl font-bold text-foreground font-mono">
            {currentBalance.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">credits available</div>
        </div>

        {/* Recent Usage */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <Icon name="ChartBarIcon" size={20} className="text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Last 7 Days</span>
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {recentUsage.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">credits used</div>
        </div>

        {/* Projected Needs */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <Icon name="TrendingUpIcon" size={20} className="text-secondary" />
            <span className="text-sm font-medium text-muted-foreground">Projected Monthly</span>
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {projectedNeeds.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">credits needed</div>
        </div>
      </div>

      {balanceStatus === 'low' && (
        <div className="mt-6 p-4 bg-error/5 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="ExclamationTriangleIcon" size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-error mb-1">Low Credit Balance</h4>
              <p className="text-sm text-error/80">
                Your current balance may not cover your projected monthly usage. Consider purchasing additional credits to avoid processing interruptions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditBalance;