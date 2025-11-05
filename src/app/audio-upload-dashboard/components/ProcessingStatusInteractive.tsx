'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProcessingStatusInteractiveProps {
  isProcessing: boolean;
  onCancel: () => void;
  fileName?: string;
  serviceName?: string;
}

const ProcessingStatusInteractive = ({ 
  isProcessing, 
  onCancel, 
  fileName = '',
  serviceName = ''
}: ProcessingStatusInteractiveProps) => {
  if (!isProcessing) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="animate-pulse-gentle">
            <Icon name="Cog6ToothIcon" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Processing Audio</h3>
            <p className="text-sm text-muted-foreground">
              {fileName && `Processing ${fileName}`}
              {serviceName && ` with ${serviceName}`}
            </p>
          </div>
        </div>
        
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-smooth"
        >
          <Icon name="XMarkIcon" size={16} />
          <span>Cancel</span>
        </button>
      </div>

      <div className="space-y-3">
        {/* Progress Indicator */}
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>

        {/* Status Messages */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Uploading file to processing server</p>
          <p>• Analyzing audio characteristics</p>
          <p>• Applying processing algorithms</p>
          <p>• Preparing results for download</p>
        </div>

        {/* Processing Info */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="InformationCircleIcon" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Processing typically takes 2-5 minutes depending on file size and service
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatusInteractive;