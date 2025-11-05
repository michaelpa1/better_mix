'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatusMessageProps {
  currentStage: string;
  message: string;
  queuePosition?: number;
}

const StatusMessage = ({ currentStage, message, queuePosition }: StatusMessageProps) => {
  const getStageIcon = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'uploading':
        return 'CloudArrowUpIcon';
      case 'analyzing':
        return 'MagnifyingGlassIcon';
      case 'processing':
        return 'Cog6ToothIcon';
      case 'enhancing':
        return 'SparklesIcon';
      case 'finalizing':
        return 'CheckCircleIcon';
      default:
        return 'ClockIcon';
    }
  };

  return (
    <div className="bg-muted/50 rounded-xl border border-border p-6">
      <div className="flex items-start space-x-3">
        <div className="animate-pulse-gentle">
          <Icon name={getStageIcon(currentStage) as any} size={20} className="text-primary mt-0.5" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-medium text-foreground mb-1">{currentStage}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
          
          {queuePosition && queuePosition > 1 && (
            <div className="mt-3 flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="QueueListIcon" size={14} />
              <span>Position {queuePosition} in queue</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusMessage;