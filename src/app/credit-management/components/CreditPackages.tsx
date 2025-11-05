'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  discount?: number;
  recommended?: boolean;
  features: string[];
  estimatedProcessing: string;
}

interface CreditPackagesProps {
  packages: CreditPackage[];
  onSelectPackage: (packageId: string) => void;
}

const CreditPackages = ({ packages, onSelectPackage }: CreditPackagesProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    onSelectPackage(packageId);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Credit Packages</h3>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/10 text-success rounded-lg">
            <Icon name="ShieldCheckIcon" size={16} />
            <span className="text-sm font-medium">SSL Secured</span>
          </div>
        </div>
        <p className="text-muted-foreground">Choose the perfect credit package for your audio processing needs</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                pkg.recommended
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : selectedPackage === pkg.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:shadow-md'
              }`}
              onClick={() => handleSelectPackage(pkg.id)}
            >
              {pkg.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Recommended
                  </div>
                </div>
              )}

              {pkg.discount && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-accent text-accent-foreground px-2 py-1 rounded-lg text-xs font-medium">
                    {pkg.discount}% OFF
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-xl font-semibold text-foreground mb-2">{pkg.name}</h4>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-foreground">${pkg.price}</span>
                  <span className="text-muted-foreground ml-1">USD</span>
                </div>
                <div className="text-2xl font-mono font-bold text-primary mb-1">
                  {pkg.credits.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">credits</div>
                <div className="text-xs text-muted-foreground mt-1">
                  ${pkg.pricePerCredit.toFixed(3)} per credit
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="MusicalNoteIcon" size={16} className="text-accent" />
                  <span className="text-muted-foreground">{pkg.estimatedProcessing}</span>
                </div>
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Icon name="CheckIcon" size={16} className="text-success" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-smooth ${
                  selectedPackage === pkg.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="InformationCircleIcon" size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-foreground font-medium mb-1">Processing Guarantee</p>
              <p className="text-muted-foreground">
                All purchases include a 30-day money-back guarantee. Credits never expire and can be used for any audio processing service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditPackages;