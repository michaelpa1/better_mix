import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProcessingDetailsProps {
  filename: string;
  serviceType: string;
  creditsUsed: number;
  fileSize: string;
  format: string;
}

const ProcessingDetails = ({ filename, serviceType, creditsUsed, fileSize, format }: ProcessingDetailsProps) => {
  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'mastering preview':
        return 'SpeakerWaveIcon';
      case 'mix enhance preview':
        return 'AdjustmentsHorizontalIcon';
      case 'mix analysis':
        return 'ChartBarIcon';
      default:
        return 'MusicalNoteIcon';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="DocumentTextIcon" size={20} className="mr-2 text-primary" />
        Processing Details
      </h3>
      
      <div className="space-y-4">
        {/* Filename */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="DocumentIcon" size={16} className="text-muted-foreground mt-0.5" />
            <span className="text-sm text-muted-foreground">File:</span>
          </div>
          <span className="text-sm font-medium text-foreground text-right max-w-xs truncate" title={filename}>
            {filename}
          </span>
        </div>
        
        {/* Service Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name={getServiceIcon(serviceType) as any} size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Service:</span>
          </div>
          <span className="text-sm font-medium text-foreground">{serviceType}</span>
        </div>
        
        {/* Credits Used */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="CurrencyDollarIcon" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Credits:</span>
          </div>
          <span className="text-sm font-medium text-foreground font-mono">{creditsUsed.toLocaleString()}</span>
        </div>
        
        {/* File Size */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="CircleStackIcon" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Size:</span>
          </div>
          <span className="text-sm font-medium text-foreground">{fileSize}</span>
        </div>
        
        {/* Format */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="CodeBracketIcon" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Format:</span>
          </div>
          <span className="text-sm font-medium text-foreground uppercase">{format}</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingDetails;