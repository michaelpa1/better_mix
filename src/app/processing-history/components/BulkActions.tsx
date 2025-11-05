'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface BulkActionsProps {
  selectedCount: number;
  onBulkReprocess: () => void;
  onBulkExport: () => void;
  onClearSelection: () => void;
}

const BulkActions = ({ selectedCount, onBulkReprocess, onBulkExport, onClearSelection }: BulkActionsProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onBulkExport();
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="CheckIcon" size={16} className="text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {selectedCount} job{selectedCount !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-muted-foreground">
              Choose an action to apply to selected items
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onBulkReprocess}
            className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
          >
            <Icon name="ArrowPathIcon" size={16} />
            <span className="hidden sm:inline">Reprocess Selected</span>
            <span className="sm:hidden">Reprocess</span>
          </button>
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-smooth disabled:opacity-50"
          >
            {isExporting ? (
              <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
            ) : (
              <Icon name="DocumentArrowDownIcon" size={16} />
            )}
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </button>
          
          <button
            onClick={onClearSelection}
            className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
            title="Clear Selection"
          >
            <Icon name="XMarkIcon" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;