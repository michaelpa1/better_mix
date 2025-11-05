'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProcessingProgress from './ProcessingProgress';
import ProcessingDetails from './ProcessingDetails';
import StatusMessage from './StatusMessage';
import ProcessingActions from './ProcessingActions';

interface ProcessingJob {
  id: string;
  filename: string;
  serviceType: string;
  creditsUsed: number;
  fileSize: string;
  format: string;
  progress: number;
  currentStage: string;
  message: string;
  queuePosition?: number;
  canCancel: boolean;
  isProcessing: boolean;
  hasError: boolean;
  estimatedTimeRemaining: string;
}

const ProcessingStatusInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [processingJob, setProcessingJob] = useState<ProcessingJob>({
    id: 'job_2025110501',
    filename: 'my_track_final_mix.wav',
    serviceType: 'Mix Enhance Preview',
    creditsUsed: 150,
    fileSize: '45.2 MB',
    format: 'wav',
    progress: 67,
    currentStage: 'Enhancing Audio',
    message: 'Applying AI-powered enhancement algorithms to improve clarity, dynamics, and overall sound quality. This process analyzes frequency content and applies targeted improvements.',
    queuePosition: 1,
    canCancel: true,
    isProcessing: true,
    hasError: false,
    estimatedTimeRemaining: '2m 15s'
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Simulate real-time progress updates
    const interval = setInterval(() => {
      setProcessingJob(prev => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          // Redirect to results after completion
          setTimeout(() => {
            router.push('/processing-results');
          }, 2000);
          return {
            ...prev,
            progress: 100,
            currentStage: 'Complete',
            message: 'Audio enhancement completed successfully! Redirecting to results...',
            isProcessing: false,
            canCancel: false,
            estimatedTimeRemaining: '0s'
          };
        }

        const newProgress = Math.min(prev.progress + Math.random() * 5, 100);
        let newStage = prev.currentStage;
        let newMessage = prev.message;
        let newTimeRemaining = prev.estimatedTimeRemaining;

        // Update stage based on progress
        if (newProgress < 20) {
          newStage = 'Uploading File';
          newMessage = 'Securely uploading your audio file to our processing servers. Please do not close this window.';
          newTimeRemaining = '4m 30s';
        } else if (newProgress < 40) {
          newStage = 'Analyzing Audio';
          newMessage = 'Performing detailed analysis of audio characteristics including frequency spectrum, dynamics, and stereo imaging.';
          newTimeRemaining = '3m 45s';
        } else if (newProgress < 80) {
          newStage = 'Enhancing Audio';
          newMessage = 'Applying AI-powered enhancement algorithms to improve clarity, dynamics, and overall sound quality. This process analyzes frequency content and applies targeted improvements.';
          newTimeRemaining = '2m 15s';
        } else if (newProgress < 95) {
          newStage = 'Finalizing';
          newMessage = 'Applying final touches and preparing your enhanced audio file for download. Almost ready!';
          newTimeRemaining = '30s';
        }

        return {
          ...prev,
          progress: Math.round(newProgress),
          currentStage: newStage,
          message: newMessage,
          estimatedTimeRemaining: newTimeRemaining,
          canCancel: newProgress < 90
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isHydrated, router]);

  const handleCancel = () => {
    setProcessingJob(prev => ({
      ...prev,
      isProcessing: false,
      hasError: true,
      currentStage: 'Cancelled',
      message: 'Processing has been cancelled. You can start a new processing job from the upload dashboard.',
      canCancel: false
    }));
  };

  const handleRetry = () => {
    router.push('/audio-upload-dashboard');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded-xl"></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-48 bg-muted rounded-xl"></div>
                <div className="h-48 bg-muted rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Processing Status</h1>
            <p className="text-muted-foreground">
              Monitor the real-time progress of your audio enhancement
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Progress Indicator */}
            <ProcessingProgress
              progress={processingJob.progress}
              estimatedTimeRemaining={processingJob.estimatedTimeRemaining}
              isProcessing={processingJob.isProcessing}
            />

            {/* Details and Status Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Processing Details */}
              <ProcessingDetails
                filename={processingJob.filename}
                serviceType={processingJob.serviceType}
                creditsUsed={processingJob.creditsUsed}
                fileSize={processingJob.fileSize}
                format={processingJob.format}
              />

              {/* Status Message */}
              <StatusMessage
                currentStage={processingJob.currentStage}
                message={processingJob.message}
                queuePosition={processingJob.queuePosition}
              />
            </div>

            {/* Actions */}
            <ProcessingActions
              canCancel={processingJob.canCancel}
              isProcessing={processingJob.isProcessing}
              onCancel={handleCancel}
              onRetry={handleRetry}
              hasError={processingJob.hasError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatusInteractive;