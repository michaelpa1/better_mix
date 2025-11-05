'use client';
import React, { useState, useEffect } from 'react';
import FileUploadZone from './FileUploadZone';
import ServiceSelectionPanel from './ServiceSelectionPanel';
import ProcessingConfirmationDialog from './ProcessingConfirmationDialog';
import ProcessingStatusInteractive from './ProcessingStatusInteractive';
import ProcessingResultsInteractive from './ProcessingResultsInteractive';
import { postMasteringPreview, postEnhancePreview, postAnalysis } from '../../lib/api';

type ServiceType = "mastering_preview" | "enhance_preview" | "analysis";
type StepType = 'upload' | 'configure' | 'processing' | 'results';

interface ProcessingResult {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  download_url?: string;
  results?: any;
  message?: string;
}

export default function AudioUploadInteractive() {
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
    window.location.href = '/processing-history';
  };

  const getCurrentMode = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bettermix:mode') || 'Dev';
    }
    return 'Dev';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Progress Steps */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : currentStep === 'configure' || currentStep === 'processing' || currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'upload' ? 'bg-blue-600 text-white' : currentStep === 'configure' || currentStep === 'processing' || currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2">Upload</span>
              </div>
              
              <div className={`flex items-center ${currentStep === 'configure' ? 'text-blue-600' : currentStep === 'processing' || currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'configure' ? 'bg-blue-600 text-white' : currentStep === 'processing' || currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2">Configure</span>
              </div>
              
              <div className={`flex items-center ${currentStep === 'processing' ? 'text-blue-600' : currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'processing' ? 'bg-blue-600 text-white' : currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="ml-2">Process</span>
              </div>
              
              <div className={`flex items-center ${currentStep === 'results' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  4
                </div>
                <span className="ml-2">Results</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Mode: <span className="font-medium">{getCurrentMode()}</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {currentStep === 'upload' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Audio File</h2>
              <FileUploadZone onSelect={handleFileSelect} />
            </div>
          )}

          {currentStep === 'configure' && selectedFile && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Configure Processing</h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Selected File</h3>
                <div className="text-sm text-gray-600">
                  <div>{selectedFile.name}</div>
                  <div>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>

              <ServiceSelectionPanel
                selectedService={selectedService}
                onServiceChange={handleServiceChange}
                onCreditsEstimate={handleCreditsEstimate}
              />

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep('upload')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleRunProcessing}
                  disabled={!selectedFile}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {getCurrentMode() === 'Prod' ? 'Run (Production)' : 'Run'}
                </button>
              </div>
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
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && getCurrentMode() === 'Prod' && (
        <ProcessingConfirmationDialog
          credits={estimatedCredits}
          message="You are using Prod mode"
          onConfirm={startProcessing}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}

      {showConfirmDialog && estimatedCredits > 0 && getCurrentMode() !== 'Prod' && (
        <ProcessingConfirmationDialog
          credits={estimatedCredits}
          onConfirm={startProcessing}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
}