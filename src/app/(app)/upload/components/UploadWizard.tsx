'use client';

import React, { useState, useCallback } from 'react';
import { FileUploadZone } from './FileUploadZone';
import Icon from '@/components/ui/AppIcon';

interface UploadedFile {
  file: File;
  url: string;
}

interface UploadWizardProps {}

const UploadWizard: React.FC<UploadWizardProps> = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedService, setSelectedService] = useState<'mastering' | 'enhancement' | 'analysis' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setUploadedFile({ file, url });
  }, []);

  const handleServiceSelect = (service: 'mastering' | 'enhancement' | 'analysis') => {
    setSelectedService(service);
  };

  const handleProcessStart = async () => {
    if (!uploadedFile || !selectedService) return;
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to results or show completion
    }, 3000);
  };

  const services = [
    {
      id: 'mastering' as const,
      title: 'AI Mastering',
      description: 'Professional mastering with AI-powered processing for release-ready sound.',
      icon: 'SparklesIcon',
    },
    {
      id: 'enhancement' as const,
      title: 'Mix Enhancement',
      description: 'Enhance clarity, balance, and depth of your existing mix.',
      icon: 'AdjustmentsHorizontalIcon',
    },
    {
      id: 'analysis' as const,
      title: 'Audio Analysis',
      description: 'Detailed technical analysis and recommendations for your track.',
      icon: 'ChartBarIcon',
    },
  ];

  return (
    <div className="min-h-full bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Upload & Process</h1>
          <p className="text-xl text-muted-foreground">
            Upload your audio file and choose a processing service
          </p>
        </div>

        {/* Step 1: File Upload */}
        <div className="studio-card studio-padding mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Step 1: Upload File</h2>
          <FileUploadZone
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile}
          />
        </div>

        {/* Step 2: Service Selection */}
        {uploadedFile && (
          <div className="studio-card studio-padding mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Step 2: Choose Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-6 rounded-xl border text-left transition-smooth ${
                    selectedService === service.id
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-white/[0.06] hover:border-primary/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <Icon name={service.icon as any} size={24} className="text-primary mr-3" />
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed">{service.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Process */}
        {uploadedFile && selectedService && (
          <div className="studio-card studio-padding">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Step 3: Process</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground mb-2">
                  Ready to process: <span className="font-medium">{uploadedFile.file.name}</span>
                </p>
                <p className="text-muted-foreground">
                  Service: {services.find(s => s.id === selectedService)?.title}
                </p>
              </div>
              <button
                onClick={handleProcessStart}
                disabled={isProcessing}
                className={`btn-primary ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <>
                    <Icon name="ArrowPathIcon" size={20} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Start Processing'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadWizard;