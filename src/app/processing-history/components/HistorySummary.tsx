import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface SummaryStats {
  totalCreditsUsed: number;
  totalJobs: number;
  successfulJobs: number;
  mostUsedService: string;
  averageCreditsPerJob: number;
}

interface HistorySummaryProps {
  stats: SummaryStats;
}

const HistorySummary = ({ stats }: HistorySummaryProps) => {
  const successRate = stats.totalJobs > 0 ? (stats.successfulJobs / stats.totalJobs) * 100 : 0;

  const summaryCards = [
    {
      title: 'Total Credits Used',
      value: stats.totalCreditsUsed.toLocaleString(),
      icon: 'CurrencyDollarIcon',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Processing Jobs',
      value: stats.totalJobs.toLocaleString(),
      icon: 'DocumentTextIcon',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      icon: 'CheckCircleIcon',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Avg Credits/Job',
      value: stats.averageCreditsPerJob.toFixed(0),
      icon: 'ChartBarIcon',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${card.bgColor}`}>
              <Icon name={card.icon as any} size={20} className={card.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncate">{card.title}</p>
              <p className="text-lg font-semibold text-foreground">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Most Used Service */}
      <div className="col-span-2 lg:col-span-4 bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="StarIcon" size={20} className="text-warning" />
          <h3 className="text-sm font-medium text-foreground">Most Used Service</h3>
        </div>
        <p className="text-lg font-semibold text-foreground capitalize">
          {stats.mostUsedService.replace('_', ' ')}
        </p>
      </div>
    </div>
  );
};

export default HistorySummary;