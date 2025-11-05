'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface ResultsData {
  filename: string;
  download_url?: string;
  results?: any;
  service?: string;
  mode?: string;
  processedAt?: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  useEffect(() => {
    // Try to get data from URL params or localStorage
    const filename = searchParams?.get('filename') || '';
    const downloadUrl = searchParams?.get('download_url') || '';
    const results = searchParams?.get('results');
    const service = searchParams?.get('service') || '';
    const mode = searchParams?.get('mode') || '';
    
    if (filename || downloadUrl || results) {
      setResultsData({
        filename,
        download_url: downloadUrl,
        results: results ? JSON.parse(decodeURIComponent(results)) : null,
        service,
        mode,
        processedAt: new Date().toLocaleString(),
      });
    } else {
      // Try to get from localStorage as fallback
      const stored = localStorage.getItem('bettermix:lastResult');
      if (stored) {
        setResultsData(JSON.parse(stored));
      }
    }
  }, [searchParams]);

  if (!resultsData) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="ExclamationTriangleIcon" size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-3">No Results Found</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We couldn't find any processing results to display. Please make sure you have a valid result link or try processing a file first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-smooth"
            >
              <Icon name="CloudArrowUpIcon" size={20} className="mr-2" />
              Start Upload
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center justify-center px-6 py-3 studio-card text-foreground rounded-xl font-medium hover:bg-muted transition-smooth"
            >
              <Icon name="DocumentTextIcon" size={20} className="mr-2" />
              View History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-success/20 border-2 border-success rounded-xl flex items-center justify-center">
              <Icon name="CheckCircleIcon" size={24} className="text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Processing Complete</h1>
              <p className="text-muted-foreground">
                {resultsData.filename} • {resultsData.service} • {resultsData.mode}
              </p>
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="space-y-6">
          {/* Download Section */}
          {resultsData.download_url && (
            <div className="studio-card studio-padding">
              <h3 className="text-lg font-semibold text-foreground mb-4">Download</h3>
              <div className="space-y-4">
                {/* Audio Player */}
                <div className="bg-muted/50 rounded-2xl p-6">
                  <audio
                    controls
                    className="w-full"
                    src={resultsData.download_url}
                    preload="metadata"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
                
                {/* Download Button */}
                <div className="flex justify-center">
                  <a
                    href={resultsData.download_url}
                    download={resultsData.filename}
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-smooth shadow-lg"
                  >
                    <Icon name="CloudArrowDownIcon" size={20} className="mr-2" />
                    Download File
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {resultsData.results && (
            <div className="studio-card studio-padding">
              <h3 className="text-lg font-semibold text-foreground mb-4">Analysis Results</h3>
              <div className="bg-muted/50 rounded-2xl p-4">
                <pre className="text-sm text-foreground overflow-auto whitespace-pre-wrap font-mono">
                  {JSON.stringify(resultsData.results, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Processing Info */}
          <div className="studio-card studio-padding">
            <h3 className="text-lg font-semibold text-foreground mb-4">Processing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Filename:</span>
                <div className="text-foreground font-mono mt-1 break-all">{resultsData.filename}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Service:</span>
                <div className="text-foreground font-medium mt-1">{resultsData.service}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Mode:</span>
                <div className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium mt-1 ${
                  resultsData.mode === 'Prod' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                  resultsData.mode === 'Mock'? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  {resultsData.mode}
                </div>
              </div>
            </div>
            {resultsData.processedAt && (
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-muted-foreground text-sm">Processed at:</span>
                <div className="text-foreground text-sm mt-1">{resultsData.processedAt}</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium text-lg hover:bg-primary/90 transition-smooth shadow-lg"
            >
              <Icon name="ArrowPathIcon" size={24} className="mr-3" />
              Run Another
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center justify-center px-8 py-4 studio-card text-foreground rounded-2xl font-medium text-lg hover:bg-muted transition-smooth"
            >
              <Icon name="DocumentTextIcon" size={24} className="mr-3" />
              Open History
            </Link>
          </div>
        </div>

        {/* Warning Note */}
        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-2xl">
          <div className="flex items-start space-x-3">
            <Icon name="ClockIcon" size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-warning font-medium mb-1">Download Link Expiration</p>
              <p className="text-warning/80">
                Download links typically expire within 24 hours for security reasons. Please save your files promptly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}