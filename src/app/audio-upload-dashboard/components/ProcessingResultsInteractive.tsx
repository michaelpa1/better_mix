'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { addHistory, type HistoryEntry } from '@/app/lib/storage';

interface ProcessingResultsInteractiveProps {
  result: {
    download_url?: string;
    results?: any;
    id?: string;
  } | null;
  fileName: string;
  serviceName: string;
  serviceType: "mastering_preview" | "enhance_preview" | "analysis";
  estimatedCredits: number;
  onBackToStart: () => void;
}

const ProcessingResultsInteractive = ({ 
  result, 
  fileName, 
  serviceName, 
  serviceType,
  estimatedCredits,
  onBackToStart 
}: ProcessingResultsInteractiveProps) => {
  const router = useRouter();

  if (!result) return null;

  const handleSaveToHistory = () => {
    const historyEntry: HistoryEntry = {
      id: result.id || `result_${Date.now()}`,
      ts: Date.now(),
      filename: fileName,
      size: 0, // File size not available in current context
      service: serviceType,
      estimatedCredits,
      resultUrl: result.download_url,
      analysisSummary: result.results
    };

    addHistory(historyEntry);
  };

  const handleViewHistory = () => {
    handleSaveToHistory();
    router.push('/processing-history');
  };

  const handleBackToStart = () => {
    handleSaveToHistory();
    onBackToStart();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-success/10 rounded-lg">
          <Icon name="CheckCircleIcon" size={24} className="text-success" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Processing Complete</h3>
          <p className="text-sm text-muted-foreground">
            {serviceName} completed for {fileName}
          </p>
        </div>
      </div>

      {/* Download Section */}
      {result.download_url && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="ArrowDownTrayIcon" size={20} className="text-primary" />
              <span className="font-medium text-primary">Download Ready</span>
            </div>
            <a
              href={result.download_url}
              download
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
            >
              <Icon name="ArrowDownTrayIcon" size={16} />
              <span>Download</span>
            </a>
          </div>

          {/* Audio Preview */}
          <div className="mb-3">
            <audio 
              controls 
              className="w-full"
              preload="metadata"
            >
              <source src={result.download_url} type="audio/mpeg" />
              <source src={result.download_url} type="audio/wav" />
              <source src={result.download_url} type="audio/flac" />
              Your browser doesn't support audio playback.
            </audio>
          </div>

          <p className="text-xs text-muted-foreground">
            Links usually expire within 24 hours.
          </p>
        </div>
      )}

      {/* Analysis Results */}
      {result.results && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="ChartBarIcon" size={20} className="text-muted-foreground" />
            <span className="font-medium text-foreground">Analysis Results</span>
          </div>
          
          <pre className="text-sm text-muted-foreground bg-background/50 p-3 rounded border overflow-auto max-h-64">
            {JSON.stringify(result.results, null, 2)}
          </pre>
          
          <p className="text-xs text-muted-foreground mt-2">
            Links usually expire within 24 hours.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handleBackToStart}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-smooth"
        >
          <Icon name="ArrowLeftIcon" size={16} />
          <span>Back to start</span>
        </button>
        
        <button
          onClick={handleViewHistory}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
        >
          <Icon name="DocumentTextIcon" size={16} />
          <span>View history</span>
        </button>
      </div>
    </div>
  );
};

export default ProcessingResultsInteractive;