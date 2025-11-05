'use client';

import React from 'react';


interface ProcessingConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  estimatedCredits: number;
  isProcessing?: boolean;
}

const ProcessingConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  estimatedCredits,
  isProcessing = false
}: ProcessingConfirmationDialogProps) => {
  if (!isOpen || estimatedCredits <= 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl p-6 max-w-md mx-4">
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/20 rounded-full">
            <span className="text-primary">💳</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Confirm Processing</h3>
            <p className="text-sm text-muted-foreground">
              This action is estimated at <strong>{estimatedCredits} credits</strong>. Continue?
            </p>
          </div>
        </div>
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Run'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessingConfirmationDialog;