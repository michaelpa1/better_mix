'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AudioPlayer from './AudioPlayer';
import WaveformComparison from './WaveformComparison';
import AnalysisResults from './AnalysisResults';
import DownloadOptions from './DownloadOptions';
import ResultsSummary from './ResultsSummary';

interface ProcessingResult {
  id: string;
  fileName: string;
  serviceType: string;
  status: 'completed';
  audioUrl: string;
  duration: number;
  originalWaveform: number[];
  processedWaveform: number[];
  analysisData: {
    overview: {
      duration: string;
      sampleRate: string;
      bitDepth: string;
      channels: string;
    };
    audioMetrics: {
      peakAmplitude: string;
      rmsLevel: string;
      dynamicRange: string;
      loudness: string;
      stereoWidth: string;
    };
    frequencyAnalysis: {
      lowFreq: string;
      midFreq: string;
      highFreq: string;
      spectralCentroid: string;
    };
    recommendations: string[];
  };
  downloadOptions: Array<{
    format: string;
    quality: string;
    size: string;
    downloadUrl: string;
  }>;
  processingDetails: {
    serviceType: string;
    creditsUsed: number;
    processingTime: string;
    fileSize: string;
    originalFormat: string;
    processedFormat: string;
    completedAt: string;
  };
  expirationTime: string;
}

const ProcessingResultsInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    
    // Mock processing result data
    const mockResult: ProcessingResult = {
      id: 'result_001',
      fileName: 'my_track_master.wav',
      serviceType: 'Mastering Preview',
      status: 'completed',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 180,
      originalWaveform: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
      processedWaveform: Array.from({ length: 200 }, () => Math.random() * 0.9 + 0.2),
      analysisData: {
        overview: {
          duration: '3:00',
          sampleRate: '44.1 kHz',
          bitDepth: '24-bit',
          channels: 'Stereo'
        },
        audioMetrics: {
          peakAmplitude: '-0.1 dB',
          rmsLevel: '-18.5 dB',
          dynamicRange: '12.3 dB',
          loudness: '-14.2 LUFS',
          stereoWidth: '85%'
        },
        frequencyAnalysis: {
          lowFreq: '-2.1 dB',
          midFreq: '+1.8 dB',
          highFreq: '+0.5 dB',
          spectralCentroid: '2.4 kHz'
        },
        recommendations: [
          'Consider reducing the low-end frequencies around 80-120Hz to improve clarity and prevent muddiness in the mix.',
          'The high frequencies above 8kHz could benefit from gentle enhancement to add more sparkle and presence to the overall sound.',
          'Dynamic range is within optimal parameters for streaming platforms. No additional compression needed.',
          'Stereo imaging is well-balanced. Consider subtle widening on the high frequencies for enhanced spatial perception.'
        ]
      },
      downloadOptions: [
        {
          format: 'wav',
          quality: 'Lossless',
          size: '52.3 MB',
          downloadUrl: 'https://example.com/download/wav'
        },
        {
          format: 'flac',
          quality: 'Lossless',
          size: '31.7 MB',
          downloadUrl: 'https://example.com/download/flac'
        },
        {
          format: 'mp3',
          quality: 'High (320kbps)',
          size: '6.9 MB',
          downloadUrl: 'https://example.com/download/mp3'
        }
      ],
      processingDetails: {
        serviceType: 'Mastering Preview',
        creditsUsed: 150,
        processingTime: '2m 34s',
        fileSize: '52.3 MB',
        originalFormat: 'wav',
        processedFormat: 'wav',
        completedAt: 'November 5, 2025 at 1:59 AM'
      },
      expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    setResult(mockResult);
  }, []);

  const handleProcessAnother = () => {
    router.push('/audio-upload-dashboard');
  };

  const handleViewHistory = () => {
    router.push('/processing-history');
  };

  if (!isHydrated || !result) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="h-64 bg-muted rounded-lg"></div>
                <div className="h-96 bg-muted rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-muted rounded-lg"></div>
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Processing Complete</h1>
              <p className="text-muted-foreground">
                Your audio file has been successfully processed and is ready for download.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleProcessAnother}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
              >
                Process Another
              </button>
              <button
                onClick={handleViewHistory}
                className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth"
              >
                View History
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Audio Player */}
            <AudioPlayer
              audioUrl={result.audioUrl}
              fileName={result.fileName}
              duration={result.duration}
            />

            {/* Waveform Comparison (for mastering/enhancement services) */}
            {(result.serviceType.toLowerCase().includes('mastering') || 
              result.serviceType.toLowerCase().includes('enhance')) && (
              <WaveformComparison
                originalWaveform={result.originalWaveform}
                processedWaveform={result.processedWaveform}
                fileName={result.fileName}
              />
            )}

            {/* Analysis Results (for analysis service) */}
            {result.serviceType.toLowerCase().includes('analysis') && (
              <AnalysisResults
                analysisData={result.analysisData}
                fileName={result.fileName}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Download Options */}
            <DownloadOptions
              downloadOptions={result.downloadOptions}
              expirationTime={result.expirationTime}
              fileName={result.fileName}
            />

            {/* Results Summary */}
            <ResultsSummary
              processingDetails={result.processingDetails}
              fileName={result.fileName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingResultsInteractive;