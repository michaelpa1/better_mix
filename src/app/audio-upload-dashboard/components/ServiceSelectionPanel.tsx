'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getQuote } from '@/app/lib/api';

type ServiceType = "mastering_preview" | "enhance_preview" | "analysis";

interface Service {
  id: ServiceType;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

interface ServiceSelectionPanelProps {
  selectedService: ServiceType | null;
  onServiceSelect: (serviceId: ServiceType) => void;
  onEstimatedCreditsChange: (credits: number) => void;
  disabled?: boolean;
}

const ServiceSelectionPanel = ({ 
  selectedService, 
  onServiceSelect, 
  onEstimatedCreditsChange,
  disabled = false 
}: ServiceSelectionPanelProps) => {
  const [estimatedCredits, setEstimatedCredits] = useState<number>(0);
  const [loadingQuote, setLoadingQuote] = useState<boolean>(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const services: Service[] = [
    {
      id: 'mastering_preview',
      name: 'Mastering Preview',
      description: 'Professional mastering with EQ, compression, and limiting for radio-ready sound',
      icon: 'AdjustmentsHorizontalIcon',
      features: ['EQ Enhancement', 'Dynamic Range Control', 'Loudness Optimization', 'Stereo Imaging']
    },
    {
      id: 'enhance_preview',
      name: 'Enhance Preview',
      description: 'AI-powered mix enhancement to improve clarity, balance, and overall sound quality',
      icon: 'SparklesIcon',
      features: ['Frequency Balance', 'Spatial Enhancement', 'Harmonic Enrichment', 'Noise Reduction']
    },
    {
      id: 'analysis',
      name: 'Analysis',
      description: 'Comprehensive analysis of your mix with detailed feedback and improvement suggestions',
      icon: 'ChartBarIcon',
      features: ['Frequency Analysis', 'Dynamic Range Report', 'Stereo Field Analysis', 'Improvement Tips']
    }
  ];

  // Fetch quote when service changes
  useEffect(() => {
    if (selectedService) {
      setLoadingQuote(true);
      setQuoteError(null);

      getQuote(selectedService)
        .then((credits) => {
          setEstimatedCredits(credits);
          onEstimatedCreditsChange(credits);
        })
        .catch((error) => {
          console.error('Failed to fetch quote:', error);
          setQuoteError('Failed to get quote');
          setEstimatedCredits(0);
          onEstimatedCreditsChange(0);
        })
        .finally(() => {
          setLoadingQuote(false);
        });
    } else {
      setEstimatedCredits(0);
      onEstimatedCreditsChange(0);
    }
  }, [selectedService, onEstimatedCreditsChange]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Select Processing Service</h2>
        <p className="text-sm text-muted-foreground">
          Choose the type of audio processing you'd like to apply to your file
        </p>
      </div>

      {/* Service Dropdown */}
      <div className="mb-6">
        <select
          value={selectedService || ''}
          onChange={(e) => onServiceSelect(e.target.value as ServiceType)}
          disabled={disabled}
          className="w-full p-3 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
        >
          <option value="">Select a service...</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quote Display */}
      {selectedService && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="CreditCardIcon" size={20} className="text-primary" />
              <span className="font-medium text-primary">Estimated Cost</span>
            </div>
            <div className="flex items-center space-x-2">
              {loadingQuote ? (
                <div className="animate-pulse-gentle">
                  <Icon name="ArrowPathIcon" size={16} className="text-primary" />
                </div>
              ) : quoteError ? (
                <span className="text-sm text-destructive">{quoteError}</span>
              ) : (
                <>
                  <span className="text-lg font-bold text-primary">{estimatedCredits}</span>
                  <span className="text-sm text-primary">credits</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Service Details */}
      {selectedService && (
        <div className="grid gap-4">
          {services
            .filter(service => service.id === selectedService)
            .map((service) => (
              <div
                key={service.id}
                className="p-6 rounded-xl border-2 border-primary bg-primary/5"
              >
                {/* Service Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                      <Icon name={service.icon as any} size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Icon name="CheckIcon" size={16} className="text-success" />
                        <span className="text-sm text-success">Selected</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Service Features */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground uppercase tracking-wide">
                    Features Included
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon name="CheckIcon" size={12} className="text-success" />
                        <span className="text-xs text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processing Time Estimate */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Icon name="ClockIcon" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Estimated processing: 2-5 minutes
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Service Comparison Note */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="LightBulbIcon" size={20} className="text-warning mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Not sure which service to choose?</p>
            <p className="text-muted-foreground">
              Start with Analysis for detailed feedback, then use Mastering Preview for final polish. 
              Enhance Preview is perfect for older recordings that need modernization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectionPanel;