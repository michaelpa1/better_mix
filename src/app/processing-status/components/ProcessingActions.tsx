'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProcessingActionsProps {
  canCancel: boolean;
  isProcessing: boolean;
  onCancel: () => void;
  onRetry?: () => void;
  hasError?: boolean;
}

const ProcessingActions = ({ canCancel, isProcessing, onCancel, onRetry, hasError }: ProcessingActionsProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    onCancel();
    setShowCancelDialog(false);
  };

  const handleCancelDialog = () => {
    setShowCancelDialog(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {hasError && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
          >
            <Icon name="ArrowPathIcon" size={16} />
            <span>Retry Processing</span>
          </button>
        )}
        
        {canCancel && isProcessing && (
          <button
            onClick={handleCancelClick}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-smooth"
          >
            <Icon name="XMarkIcon" size={16} />
            <span>Cancel Processing</span>
          </button>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-destructive/10 rounded-lg">
                <Icon name="ExclamationTriangleIcon" size={20} className="text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Cancel Processing</h3>
                <p className="text-sm text-muted-foreground">Are you sure you want to cancel?</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Canceling will stop the current processing and you will not be refunded the credits used for this operation.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDialog}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-smooth"
              >
                Keep Processing
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-smooth"
              >
                Cancel Processing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProcessingActions;