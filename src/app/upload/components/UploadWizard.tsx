'use client';

import React, { useState, useEffect } from 'react';
import FileUploadZone from '../../audio-upload-dashboard/components/FileUploadZone';
import ServiceSelectionPanel from '../../audio-upload-dashboard/components/ServiceSelectionPanel';
import ProcessingConfirmationDialog from '../../audio-upload-dashboard/components/ProcessingConfirmationDialog';
import ProcessingStatusInteractive from '../../audio-upload-dashboard/components/ProcessingStatusInteractive';
import ProcessingResultsInteractive from '../../audio-upload-dashboard/components/ProcessingResultsInteractive';
import { postMasteringPreview, postEnhancePreview, postAnalysis } from '../../lib/api';
import Icon from '@/components/ui/AppIcon';

type ServiceType = "mastering_preview" | "enhance_preview" | "analysis";
type StepType = 'upload' | 'configure' | 'processing' | 'results';

interface ProcessingResult {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  download_url?: string;
  results?: any;
  message?: string;
}

export default function UploadWizard() {
  const [currentStep, setCurrentStep] = useState<StepType>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>('mastering_preview');
  const [estimatedCredits, setEstimatedCredits] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (file) {
      setCurrentStep('configure');
    }
  };

  const handleServiceChange = (service: ServiceType) => {
    setSelectedService(service);
  };

  const handleCreditsEstimate = (credits: number) => {
    setEstimatedCredits(credits);
  };

  const handleRunProcessing = () => {
    if (estimatedCredits > 0) {
      setShowConfirmDialog(true);
    } else {
      startProcessing();
    }
  };

  const startProcessing = async () => {
    if (!selectedFile) return;

    setShowConfirmDialog(false);
    setCurrentStep('processing');
    setProcessing(true);
    setError(null);
    setProcessingProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      let result: ProcessingResult;

      switch (selectedService) {
        case 'mastering_preview':
          result = await postMasteringPreview(selectedFile, {
            musical_style: 'POP',
            loudness: 'MEDIUM',
            sample_rate: '44100'
          });
          break;
        case 'enhance_preview':
          result = await postEnhancePreview(selectedFile);
          break;
        case 'analysis':
          result = await postAnalysis(selectedFile);
          break;
        default:
          throw new Error('Invalid service type');
      }

      // Complete progress and show results
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      setTimeout(() => {
        setProcessingResult(result);
        setCurrentStep('results');
        setProcessing(false);

        // Create job record via API
        createJobRecord(result);
      }, 1000);

    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Processing failed');
      setProcessing(false);
      setCurrentStep('configure');
    }
  };

  const createJobRecord = async (result: ProcessingResult) => {
    if (!selectedFile) return;

    try {
      await fetch('/api/admin/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: selectedFile.name,
          size: selectedFile.size,
          service: selectedService,
          mode: localStorage.getItem('bettermix:mode') || 'Dev',
          estimatedCredits,
          resultUrl: result.download_url,
          analysisSummary: result.results ? JSON.stringify(result.results) : undefined,
        }),
      });
    } catch (error) {
      console.error('Failed to create job record:', error);
      // Don't show error to user as the processing was successful
    }
  };

  const handleBackToStart = () => {
    setCurrentStep('upload');
    setSelectedFile(null);
    setSelectedService('mastering_preview');
    setEstimatedCredits(0);
    setProcessingResult(null);
    setError(null);
    setProcessingProgress(0);
  };

  const handleViewHistory = () => {
    window.location.href = '/history';
  };

  const getCurrentMode = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bettermix:mode') || 'Dev';
    }
    return 'Dev';
  };

  const steps = [
    { key: 'upload', label: 'Upload', number: 1 },
    { key: 'configure', label: 'Configure', number: 2 },
    { key: 'processing', label: 'Process', number: 3 },
    { key: 'results', label: 'Results', number: 4 },
  ];

  const getStepStatus = (stepKey: string) => {
    const stepIndex = steps.findIndex(s => s.key === stepKey);
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-5xl mx-auto studio-padding">
      <div className="studio-card overflow-hidden">
        {/* Clear Stepper at the Top */}
        <div className="bg-card border-b border-white/[0.06] studio-padding">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              {steps.map((step, index) => {
                const status = getStepStatus(step.key);
                return (
                  <div key={step.key} className="flex items-center">
                    <div className={`flex items-center ${
                      status === 'current' ? 'text-primary' : 
                      status === 'completed' ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium border-2 ${
                        status === 'current' ? 'bg-primary/10 border-primary text-primary' : 
                        status === 'completed' ? 'bg-success/10 border-success text-success' : 'bg-muted border-white/[0.06] text-muted-foreground'
                      }`}>
                        {status === 'completed' ? (
                          <Icon name="CheckIcon" size={20} />
                        ) : (
                          step.number
                        )}
                      </div>
                      <span className="ml-3 font-medium">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-6 ${
                        getStepStatus(steps[index + 1].key) === 'completed' ? 'bg-success' : 'bg-white/[0.06]'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className={`px-4 py-2 rounded-lg font-medium border ${
              getCurrentMode() === 'Prod' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
              getCurrentMode() === 'Mock' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
            }`}>
              {getCurrentMode()}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="studio-padding">
          {currentStep === 'upload' && (
            <div className="text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 text-primary">
                  <Icon name="CloudArrowUpIcon" size={64} />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Upload your audio file</h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                  Drop your WAV, FLAC, or MP3 file to get started
                </p>
                <FileUploadZone onSelect={handleFileSelect} />
              </div>
            </div>
          )}

          {currentStep === 'configure' && selectedFile && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Configure Processing</h2>
                <p className="text-xl text-muted-foreground">Choose your service and review settings</p>
              </div>
              
              <div className="studio-card studio-padding">
                <h3 className="text-lg font-medium text-foreground mb-4">Selected File</h3>
                <div className="flex items-center space-x-4">
                  <Icon name="DocumentTextIcon" size={24} className="text-muted-foreground" />
                  <div>
                    <div className="text-foreground font-medium">{selectedFile.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              </div>

              <ServiceSelectionPanel
                selectedService={selectedService}
                onServiceChange={handleServiceChange}
                onCreditsEstimate={handleCreditsEstimate}
              />

              {error && (
                <div className="bg-error/10 border border-error/20 rounded-xl studio-padding">
                  <div className="flex items-start space-x-3">
                    <Icon name="ExclamationTriangleIcon" size={20} className="text-error flex-shrink-0 mt-0.5" />
                    <span className="text-error">{error}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'processing' && (
            <ProcessingStatusInteractive
              isProcessing={processing}
              progress={processingProgress}
              onCancel={() => {
                setProcessing(false);
                setCurrentStep('configure');
              }}
            />
          )}

          {currentStep === 'results' && processingResult && (
            <ProcessingResultsInteractive
              result={processingResult}
              filename={selectedFile?.name || ''}
              onBackToStart={handleBackToStart}
              onViewHistory={handleViewHistory}
            />
          )}
        </div>

        {/* Sticky Footer with Navigation */}
        {(currentStep === 'configure') && (
          <div className="bg-card border-t border-white/[0.06] studio-padding">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep('upload')}
                className="btn-secondary"
              >
                <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
                Back
              </button>
              <button
                onClick={handleRunProcessing}
                disabled={!selectedFile}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getCurrentMode() === 'Prod' ? 'Run (Production)' : 'Run Processing'}
                <Icon name="ArrowRightIcon" size={20} className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ProcessingConfirmationDialog
          credits={estimatedCredits}
          message={getCurrentMode() === 'Prod' ? "You are using Prod mode" : undefined}
          onConfirm={startProcessing}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
}