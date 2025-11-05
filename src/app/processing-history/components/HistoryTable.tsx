'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProcessingJob {
  id: string;
  timestamp: string;
  filename: string;
  serviceType: 'mastering' | 'enhance' | 'analysis';
  creditsUsed: number;
  status: 'completed' | 'failed' | 'expired';
  resultUrl?: string;
  analysisData?: any;
  expiresAt: string;
}

interface HistoryTableProps {
  jobs: ProcessingJob[];
  onReprocess: (job: ProcessingJob) => void;
  onDownload: (job: ProcessingJob) => void;
  onViewAnalysis: (job: ProcessingJob) => void;
}

const HistoryTable = ({ jobs, onReprocess, onDownload, onViewAnalysis }: HistoryTableProps) => {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof ProcessingJob>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'mastering': return 'MusicalNoteIcon';
      case 'enhance': return 'SparklesIcon';
      case 'analysis': return 'ChartBarIcon';
      default: return 'DocumentIcon';
    }
  };

  const getServiceLabel = (serviceType: string) => {
    switch (serviceType) {
      case 'mastering': return 'Mastering Preview';
      case 'enhance': return 'Mix Enhance Preview';
      case 'analysis': return 'Mix Analysis';
      default: return serviceType;
    }
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (status === 'failed') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
          <Icon name="XCircleIcon" size={12} className="mr-1" />
          Failed
        </span>
      );
    }
    
    if (isExpired) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
          <Icon name="ClockIcon" size={12} className="mr-1" />
          Expired
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
        <Icon name="CheckCircleIcon" size={12} className="mr-1" />
        Available
      </span>
    );
  };

  const handleSort = (field: keyof ProcessingJob) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedJobs(selectedJobs.length === jobs.length ? [] : jobs.map(job => job.id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedJobs.length === jobs.length && jobs.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Date</span>
                  <Icon name="ChevronUpDownIcon" size={16} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('filename')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>File</span>
                  <Icon name="ChevronUpDownIcon" size={16} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Service</span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('creditsUsed')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Credits</span>
                  <Icon name="ChevronUpDownIcon" size={16} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedJobs.includes(job.id)}
                    onChange={() => toggleJobSelection(job.id)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-foreground">{formatDate(job.timestamp)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="DocumentIcon" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground truncate max-w-xs">{job.filename}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Icon name={getServiceIcon(job.serviceType) as any} size={16} className="text-primary" />
                    <span className="text-sm text-foreground">{getServiceLabel(job.serviceType)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-foreground">{job.creditsUsed.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(job.status, job.expiresAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-2">
                    {job.serviceType === 'analysis' && job.analysisData && (
                      <button
                        onClick={() => onViewAnalysis(job)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-smooth"
                        title="View Analysis"
                      >
                        <Icon name="EyeIcon" size={16} className="text-muted-foreground" />
                      </button>
                    )}
                    {job.resultUrl && !isExpired(job.expiresAt) && job.status === 'completed' && (
                      <button
                        onClick={() => onDownload(job)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-smooth"
                        title="Download"
                      >
                        <Icon name="ArrowDownTrayIcon" size={16} className="text-muted-foreground" />
                      </button>
                    )}
                    <button
                      onClick={() => onReprocess(job)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-smooth"
                      title="Reprocess"
                    >
                      <Icon name="ArrowPathIcon" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {jobs.map((job) => (
          <div key={job.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedJobs.includes(job.id)}
                  onChange={() => toggleJobSelection(job.id)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <div className="text-sm font-medium text-foreground truncate max-w-48">
                    {job.filename}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(job.timestamp)}
                  </div>
                </div>
              </div>
              {getStatusBadge(job.status, job.expiresAt)}
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon name={getServiceIcon(job.serviceType) as any} size={16} className="text-primary" />
                <span className="text-sm text-foreground">{getServiceLabel(job.serviceType)}</span>
              </div>
              <span className="text-sm font-mono text-foreground">{job.creditsUsed.toLocaleString()} credits</span>
            </div>
            
            <div className="flex items-center justify-end space-x-2">
              {job.serviceType === 'analysis' && job.analysisData && (
                <button
                  onClick={() => onViewAnalysis(job)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
                >
                  <Icon name="EyeIcon" size={16} />
                  <span>View</span>
                </button>
              )}
              {job.resultUrl && !isExpired(job.expiresAt) && job.status === 'completed' && (
                <button
                  onClick={() => onDownload(job)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
                >
                  <Icon name="ArrowDownTrayIcon" size={16} />
                  <span>Download</span>
                </button>
              )}
              <button
                onClick={() => onReprocess(job)}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
              >
                <Icon name="ArrowPathIcon" size={16} />
                <span>Reprocess</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="DocumentTextIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No processing history</h3>
          <p className="text-muted-foreground mb-4">
            Your processed audio files will appear here once you start using our services.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;