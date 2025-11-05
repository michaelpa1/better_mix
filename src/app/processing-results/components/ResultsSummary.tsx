import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProcessingDetails {
  serviceType: string;
  creditsUsed: number;
  processingTime: string;
  fileSize: string;
  originalFormat: string;
  processedFormat: string;
  completedAt: string;
}

interface ResultsSummaryProps {
  processingDetails: ProcessingDetails;
  fileName: string;
}

const ResultsSummary = ({ processingDetails, fileName }: ResultsSummaryProps) => {
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'mastering preview': return 'AdjustmentsHorizontalIcon';
      case 'mix enhance preview': return 'SparklesIcon';
      case 'mix analysis': return 'ChartBarIcon';
      default: return 'MusicalNoteIcon';
    }
  };

  const getServiceColor = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'mastering preview': return 'text-primary';
      case 'mix enhance preview': return 'text-accent';
      case 'mix analysis': return 'text-success';
      default: return 'text-foreground';
    }
  };

  const summaryItems = [
    {
      label: 'Service Used',
      value: processingDetails.serviceType,
      icon: getServiceIcon(processingDetails.serviceType),
      color: getServiceColor(processingDetails.serviceType)
    },
    {
      label: 'Credits Used',
      value: `${processingDetails.creditsUsed.toLocaleString()} credits`,
      icon: 'CurrencyDollarIcon',
      color: 'text-warning'
    },
    {
      label: 'Processing Time',
      value: processingDetails.processingTime,
      icon: 'ClockIcon',
      color: 'text-muted-foreground'
    },
    {
      label: 'File Size',
      value: processingDetails.fileSize,
      icon: 'DocumentIcon',
      color: 'text-muted-foreground'
    },
    {
      label: 'Original Format',
      value: processingDetails.originalFormat.toUpperCase(),
      icon: 'ArrowRightIcon',
      color: 'text-muted-foreground'
    },
    {
      label: 'Output Format',
      value: processingDetails.processedFormat.toUpperCase(),
      icon: 'CheckCircleIcon',
      color: 'text-success'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Processing Summary</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="InformationCircleIcon" size={16} />
          <span>{fileName}</span>
        </div>
      </div>

      {/* Processing Status */}
      <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-success rounded-full">
            <Icon name="CheckIcon" size={20} className="text-success-foreground" />
          </div>
          <div>
            <div className="font-semibold text-success">Processing Complete</div>
            <div className="text-sm text-muted-foreground">
              Completed on {processingDetails.completedAt}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {summaryItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
            <Icon name={item.icon as any} size={20} className="text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className={`font-medium ${item.color}`}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* File Information */}
      <div className="border-t border-border pt-6">
        <h4 className="text-base font-semibold text-foreground mb-4">File Information</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Original Filename</span>
            <span className="text-sm font-medium text-foreground">{fileName}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Processing ID</span>
            <span className="text-sm font-mono text-foreground">#BM-{Date.now().toString().slice(-6)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Quality Enhancement</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-medium text-success">Applied</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth">
            <Icon name="ArrowPathIcon" size={16} />
            <span>Process Another</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth">
            <Icon name="ClockIcon" size={16} />
            <span>View History</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth">
            <Icon name="ShareIcon" size={16} />
            <span>Share Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;