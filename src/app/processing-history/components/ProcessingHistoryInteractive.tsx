'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { listHistory, clearHistory, type HistoryEntry } from '@/app/lib/storage';

const ProcessingHistoryInteractive = () => {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyData = listHistory();
    setHistory(historyData);
  };

  const handleRowClick = (entry: HistoryEntry) => {
    router.push(`/processing-results?id=${entry.id}`);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getServiceName = (service: string): string => {
    switch (service) {
      case 'mastering_preview':
        return 'Mastering Preview';
      case 'enhance_preview':
        return 'Enhance Preview';
      case 'analysis':
        return 'Analysis';
      default:
        return service;
    }
  };

  if (!isHydrated) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-64" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Processing History</h2>
          <p className="text-muted-foreground">
            View your past audio processing results
          </p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-smooth"
          >
            <Icon name="TrashIcon" size={16} />
            <span>Clear history</span>
          </button>
        )}
      </div>

      {/* History Table */}
      {history.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <Icon name="DocumentTextIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Processing History</h3>
          <p className="text-muted-foreground mb-4">
            Your processed files will appear here once you start using the service.
          </p>
          <a
            href="/audio-upload-dashboard"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
          >
            <Icon name="CloudArrowUpIcon" size={16} />
            <span>Upload Audio</span>
          </a>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => handleRowClick(entry)}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {formatDate(entry.ts)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Icon name="DocumentIcon" size={16} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-48">
                            {entry.filename}
                          </p>
                          {entry.size > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(entry.size)}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {getServiceName(entry.service)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-foreground">
                      {entry.estimatedCredits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {entry.resultUrl ? (
                          <div className="flex items-center space-x-1">
                            <Icon name="ArrowDownTrayIcon" size={14} className="text-success" />
                            <span className="text-sm text-success">Download</span>
                          </div>
                        ) : entry.analysisSummary ? (
                          <div className="flex items-center space-x-1">
                            <Icon name="ChartBarIcon" size={14} className="text-primary" />
                            <span className="text-sm text-primary">Analysis</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(entry);
                        }}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clear Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowClearConfirm(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Icon name="ExclamationTriangleIcon" size={24} className="text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Clear History</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Are you sure you want to clear all processing history? This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-smooth"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingHistoryInteractive;