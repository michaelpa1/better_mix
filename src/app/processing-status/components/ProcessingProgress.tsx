'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProcessingProgressProps {
  progress: number;
  estimatedTimeRemaining: string;
  isProcessing: boolean;
}

const ProcessingProgress = ({ progress, estimatedTimeRemaining, isProcessing }: ProcessingProgressProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-8 text-center">
      <div className="mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          {/* Background Circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted"
            />
            {/* Progress Circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={351.86}
              strokeDashoffset={351.86 - (progress / 100) * 351.86}
              className="text-primary transition-all duration-500 ease-out"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isProcessing ? (
              <div className="animate-pulse-gentle">
                <Icon name="Cog6ToothIcon" size={24} className="text-primary mb-1" />
              </div>
            ) : (
              <Icon name="CheckCircleIcon" size={24} className="text-success mb-1" />
            )}
            <span className="text-2xl font-bold text-foreground">{progress}%</span>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {isProcessing ? 'Processing Audio' : 'Processing Complete'}
        </h2>
        
        {isProcessing && (
          <p className="text-muted-foreground">
            Estimated time remaining: <span className="font-mono font-medium text-foreground">{estimatedTimeRemaining}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProcessingProgress;