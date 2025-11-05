'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface HistoryItem {
  id: string;
  filename: string;
  service: string;
  mode: string;
  credits: number;
  outcome: 'success' | 'failed' | 'processing';
  createdAt: string;
  downloadUrl?: string;
  results?: any;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll use localStorage as a fallback
      const stored = localStorage.getItem('bettermix:history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        // Mock data for demonstration
        const mockHistory: HistoryItem[] = [
          {
            id: '1',
            filename: 'track_001.wav',
            service: 'Mastering Preview',
            mode: 'Dev',
            credits: 150,
            outcome: 'success',
            createdAt: '2025-11-05T10:30:00Z',
            downloadUrl: 'https://example.com/download/1',
          },
          {
            id: '2',
            filename: 'vocal_mix.mp3',
            service: 'Mix Enhance',
            mode: 'Prod',
            credits: 200,
            outcome: 'success',
            createdAt: '2025-11-05T09:15:00Z',
            downloadUrl: 'https://example.com/download/2',
          },
          {
            id: '3',
            filename: 'demo_track.flac',
            service: 'Analysis',
            mode: 'Mock',
            credits: 50,
            outcome: 'success',
            createdAt: '2025-11-05T08:45:00Z',
            results: { tempo: 120, key: 'C Major', loudness: -14.2 },
          },
        ];
        setHistory(mockHistory);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (item: HistoryItem) => {
    if (item.outcome === 'success') {
      const params = new URLSearchParams();
      params.set('filename', item.filename);
      params.set('service', item.service);
      params.set('mode', item.mode);
      
      if (item.downloadUrl) {
        params.set('download_url', item.downloadUrl);
      }
      
      if (item.results) {
        params.set('results', encodeURIComponent(JSON.stringify(item.results)));
      }

      router.push(`/results?${params.toString()}`);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('bettermix:history');
    setShowClearModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return <Icon name="CheckCircleIcon" size={16} className="text-success" />;
      case 'failed':
        return <Icon name="XCircleIcon" size={16} className="text-error" />;
      case 'processing':
        return <Icon name="ArrowPathIcon" size={16} className="text-warning animate-spin" />;
      default:
        return <Icon name="MinusCircleIcon" size={16} className="text-muted-foreground" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Prod':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Mock':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Processing History</h1>
            <p className="text-muted-foreground">
              View and manage your audio processing history
            </p>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-error hover:text-error/80 hover:bg-error/10 rounded-lg transition-smooth"
            >
              <Icon name="TrashIcon" size={16} className="mr-2" />
              Clear History
            </button>
          )}
        </div>

        {/* Content */}
        {history.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="DocumentTextIcon" size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">No runs yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Once you start processing audio files, your history will appear here. You'll be able to re-download files and view analysis results.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium text-lg hover:bg-primary/90 transition-smooth shadow-lg"
            >
              <Icon name="CloudArrowUpIcon" size={24} className="mr-3" />
              Start an Upload
            </Link>
          </div>
        ) : (
          /* History Table */
          <div className="studio-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">Time</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">File</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Service</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Mode</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Credits</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Outcome</th>
                    <th className="w-12 p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item)}
                      className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-smooth ${
                        item.outcome === 'success' ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <td className="p-4">
                        <div className="text-sm text-foreground">
                          {formatDate(item.createdAt)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-foreground font-medium break-all">
                          {item.filename}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-foreground">
                          {item.service}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium border ${getModeColor(item.mode)}`}>
                          {item.mode}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-foreground">
                          {item.credits}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getOutcomeIcon(item.outcome)}
                          <span className="text-sm text-foreground capitalize">
                            {item.outcome}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {item.outcome === 'success' && (
                          <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clear History Modal */}
        {showClearModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowClearModal(false)} />
            <div className="bg-card border border-border rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-error/20 border-2 border-error rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="ExclamationTriangleIcon" size={24} className="text-error" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Clear History</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    Are you sure you want to clear all processing history? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={clearHistory}
                      className="flex-1 px-4 py-2 bg-error text-error-foreground rounded-lg font-medium hover:bg-error/90 transition-smooth"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowClearModal(false)}
                      className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-smooth"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}