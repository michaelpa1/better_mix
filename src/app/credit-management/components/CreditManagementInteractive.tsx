'use client';

import React, { useState, useEffect } from 'react';
import CreditBalance from './CreditBalance';
import UsageHistory from './UsageHistory';
import CreditPackages from './CreditPackages';
import UsageAnalytics from './UsageAnalytics';
import PaymentFlow from './PaymentFlow';

interface UsageTransaction {
  id: string;
  type: 'usage' | 'purchase' | 'bonus';
  description: string;
  amount: number;
  timestamp: string;
  service?: string;
  filename?: string;
}

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

interface MonthlyUsage {
  month: string;
  credits: number;
  sessions: number;
}

interface ServiceUsage {
  service: string;
  credits: number;
  percentage: number;
  color: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

const CreditManagementInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Mock data
  const mockTransactions: UsageTransaction[] = [
    {
      id: "1",
      type: "purchase",
      description: "Credit Package Purchase - Starter",
      amount: 1000,
      timestamp: "2024-11-04T14:30:00Z"
    },
    {
      id: "2",
      type: "usage",
      description: "Audio Mastering Service",
      amount: -50,
      timestamp: "2024-11-04T10:15:00Z",
      service: "Mastering Preview",
      filename: "track_final_mix.wav"
    },
    {
      id: "3",
      type: "usage",
      description: "Mix Enhancement Processing",
      amount: -75,
      timestamp: "2024-11-03T16:45:00Z",
      service: "Mix Enhance Preview",
      filename: "podcast_episode_12.mp3"
    },
    {
      id: "4",
      type: "bonus",
      description: "Welcome Bonus Credits",
      amount: 100,
      timestamp: "2024-11-01T09:00:00Z"
    },
    {
      id: "5",
      type: "usage",
      description: "Audio Analysis Report",
      amount: -25,
      timestamp: "2024-10-30T13:20:00Z",
      service: "Mix Analysis",
      filename: "demo_recording.flac"
    }
  ];

  const mockPackages: CreditPackage[] = [
    {
      id: "starter",
      name: "Starter",
      credits: 1000,
      price: 29.99,
      pricePerCredit: 0.030,
      features: [
        "Perfect for beginners",
        "All processing services",
        "24/7 email support",
        "Credits never expire"
      ],
      estimatedProcessing: "~20 audio files"
    },
    {
      id: "professional",
      name: "Professional",
      credits: 3000,
      price: 79.99,
      pricePerCredit: 0.027,
      discount: 10,
      recommended: true,
      features: [
        "Most popular choice",
        "All processing services",
        "Priority processing queue",
        "24/7 phone & email support",
        "Credits never expire"
      ],
      estimatedProcessing: "~60 audio files"
    },
    {
      id: "studio",
      name: "Studio",
      credits: 10000,
      price: 249.99,
      pricePerCredit: 0.025,
      discount: 17,
      features: [
        "Best value for studios",
        "All processing services",
        "Highest priority processing",
        "Dedicated account manager",
        "Custom processing options",
        "Credits never expire"
      ],
      estimatedProcessing: "~200 audio files"
    }
  ];

  const mockMonthlyData: MonthlyUsage[] = [
    { month: "Jul", credits: 450, sessions: 18 },
    { month: "Aug", credits: 620, sessions: 25 },
    { month: "Sep", credits: 380, sessions: 15 },
    { month: "Oct", credits: 720, sessions: 29 },
    { month: "Nov", credits: 150, sessions: 6 }
  ];

  const mockServiceData: ServiceUsage[] = [
    { service: "Mastering Preview", credits: 1200, percentage: 52, color: "#2563eb" },
    { service: "Mix Enhance Preview", credits: 750, percentage: 32, color: "#0ea5e9" },
    { service: "Mix Analysis", credits: 370, percentage: 16, color: "#64748b" }
  ];

  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: "card_1",
      type: "card",
      last4: "4242",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true
    },
    {
      id: "card_2",
      type: "card",
      last4: "8888",
      brand: "mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    },
    {
      id: "paypal_1",
      type: "paypal",
      isDefault: false
    }
  ];

  const handleSelectPackage = (packageId: string) => {
    const pkg = mockPackages.find(p => p.id === packageId);
    setSelectedPackage(pkg || null);
  };

  const handleProcessPayment = async (paymentMethodId: string) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setSelectedPackage(null);
    
    // In a real app, this would redirect to success page or show success message
    alert(`Payment successful! ${selectedPackage?.credits.toLocaleString()} credits have been added to your account.`);
  };

  const handleAddPaymentMethod = () => {
    // In a real app, this would open a payment method form
    alert("Add payment method functionality would be implemented here.");
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse-gentle space-y-8">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded" />
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Credit Management</h1>
          <p className="text-muted-foreground">
            Manage your credit balance, view usage history, and purchase additional credits for audio processing services.
          </p>
        </div>

        <div className="space-y-8">
          {/* Credit Balance */}
          <CreditBalance
            currentBalance={950}
            recentUsage={150}
            projectedNeeds={800}
          />

          {/* Credit Packages and Payment Flow */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <CreditPackages
                packages={mockPackages}
                onSelectPackage={handleSelectPackage}
              />
            </div>
            <div>
              <PaymentFlow
                selectedPackage={selectedPackage}
                paymentMethods={mockPaymentMethods}
                onProcessPayment={handleProcessPayment}
                onAddPaymentMethod={handleAddPaymentMethod}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {/* Usage Analytics and History */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <UsageAnalytics
                monthlyData={mockMonthlyData}
                serviceData={mockServiceData}
                totalCreditsUsed={2320}
                averageMonthly={464}
              />
            </div>
            <div>
              <UsageHistory transactions={mockTransactions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditManagementInteractive;