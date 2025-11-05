'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Metadata } from 'next/types';
import Header from '@/components/common/Header';
import ProcessingResultsInteractive from './components/ProcessingResultsInteractive';
import { getHistoryEntry, type HistoryEntry } from '@/app/lib/storage';

// export const metadata: Metadata = {
//   title: 'Processing Results - Better Mix',
//   description: 'View your audio processing results and download processed files.',
// };

export default function ProcessingResultsPage() {
  const searchParams = useSearchParams();
  const [historyEntry, setHistoryEntry] = useState<HistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resultId = searchParams.get('id');
    
    if (resultId) {
      const entry = getHistoryEntry(resultId);
      setHistoryEntry(entry);
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <>
        <Header creditBalance={1250} />
        <div className="min-h-screen bg-background pt-16">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mb-8" />
              <div className="h-64 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!historyEntry) {
    return (
      <>
        <Header creditBalance={1250} />
        <div className="min-h-screen bg-background pt-16">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Processing Result Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The requested processing result could not be found or may have expired.
              </p>
              <a
                href="/audio-upload-dashboard"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
              >
                <span>Back to Upload</span>
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  const mockResult = {
    id: historyEntry.id,
    download_url: historyEntry.resultUrl,
    results: historyEntry.analysisSummary
  };

  return (
    <>
      <Header creditBalance={1250} />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Processing Results</h1>
            <p className="text-muted-foreground">
              View and download your processed audio file
            </p>
          </div>

          {/* Results */}
          <ProcessingResultsInteractive
            result={mockResult}
            fileName={historyEntry.filename}
            serviceName={getServiceName(historyEntry.service)}
            serviceType={historyEntry.service}
            estimatedCredits={historyEntry.estimatedCredits}
            onBackToStart={() => {
              window.location.href = '/audio-upload-dashboard';
            }}
          />
        </div>
      </div>
    </>
  );
}

function getServiceName(service: "mastering_preview" | "enhance_preview" | "analysis"): string {
  switch (service) {
    case 'mastering_preview':
      return 'Mastering Preview';
    case 'enhance_preview':
      return 'Enhance Preview';
    case 'analysis':
      return 'Analysis';
    default:
      return 'Unknown Service';
  }
}