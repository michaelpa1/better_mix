'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface PaymentFlowProps {
  selectedPackage: any;
  paymentMethods: PaymentMethod[];
  onProcessPayment: (paymentMethodId: string) => void;
  onAddPaymentMethod: () => void;
  isProcessing: boolean;
}

const PaymentFlow = ({ 
  selectedPackage, 
  paymentMethods, 
  onProcessPayment, 
  onAddPaymentMethod,
  isProcessing 
}: PaymentFlowProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentMethods.find(pm => pm.isDefault)?.id || ''
  );
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  const getPaymentIcon = (type: string, brand?: string) => {
    if (type === 'card') {
      switch (brand?.toLowerCase()) {
        case 'visa':
          return 'CreditCardIcon';
        case 'mastercard':
          return 'CreditCardIcon';
        case 'amex':
          return 'CreditCardIcon';
        default:
          return 'CreditCardIcon';
      }
    }
    if (type === 'paypal') return 'CurrencyDollarIcon';
    if (type === 'bank') return 'BuildingLibraryIcon';
    return 'CreditCardIcon';
  };

  const formatCardNumber = (last4: string, brand: string) => {
    return `•••• •••• •••• ${last4}`;
  };

  const handlePayment = () => {
    if (selectedPaymentMethod) {
      onProcessPayment(selectedPaymentMethod);
    }
  };

  if (!selectedPackage) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-center">
        <Icon name="CreditCardIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Select a Credit Package</h3>
        <p className="text-muted-foreground">Choose a credit package above to proceed with payment.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Secure Checkout</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-success">
              <Icon name="LockClosedIcon" size={16} />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-success">
              <Icon name="ShieldCheckIcon" size={16} />
              <span>PCI Compliant</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Order Summary */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-foreground mb-3">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{selectedPackage.name}</span>
              <span className="text-foreground">${selectedPackage.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Credits</span>
              <span className="text-foreground font-mono">{selectedPackage.credits.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing Fee</span>
              <span className="text-foreground">$0.00</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${selectedPackage.price} USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Payment Method</h4>
            <button
              onClick={onAddPaymentMethod}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
            >
              Add New Method
            </button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-smooth ${
                  selectedPaymentMethod === method.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getPaymentIcon(method.type, method.brand) as any} 
                      size={24} 
                      className="text-muted-foreground" 
                    />
                    <div>
                      {method.type === 'card' && (
                        <>
                          <div className="font-medium text-foreground">
                            {method.brand?.toUpperCase()} {formatCardNumber(method.last4!, method.brand!)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                          </div>
                        </>
                      )}
                      {method.type === 'paypal' && (
                        <div className="font-medium text-foreground">PayPal Account</div>
                      )}
                      {method.type === 'bank' && (
                        <div className="font-medium text-foreground">Bank Transfer</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                        Default
                      </span>
                    )}
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedPaymentMethod === method.id
                        ? 'border-primary bg-primary' :'border-muted-foreground'
                    }`}>
                      {selectedPaymentMethod === method.id && (
                        <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Information */}
        <div className="mb-6">
          <button
            onClick={() => setShowSecurityInfo(!showSecurityInfo)}
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name={showSecurityInfo ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
            <span>Security & Privacy Information</span>
          </button>
          
          {showSecurityInfo && (
            <div className="mt-3 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground space-y-2">
              <div className="flex items-start space-x-2">
                <Icon name="LockClosedIcon" size={16} className="flex-shrink-0 mt-0.5" />
                <span>All payments are processed using industry-standard 256-bit SSL encryption</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="ShieldCheckIcon" size={16} className="flex-shrink-0 mt-0.5" />
                <span>We are PCI DSS Level 1 compliant and never store your payment information</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="EyeSlashIcon" size={16} className="flex-shrink-0 mt-0.5" />
                <span>Your financial data is protected and never shared with third parties</span>
              </div>
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePayment}
          disabled={!selectedPaymentMethod || isProcessing}
          className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg font-medium text-lg transition-smooth hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-pulse-gentle">
                <Icon name="Cog6ToothIcon" size={20} />
              </div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <Icon name="CreditCardIcon" size={20} />
              <span>Purchase {selectedPackage.credits.toLocaleString()} Credits</span>
            </>
          )}
        </button>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy. \
          Credits never expire and can be used for any audio processing service.
        </div>
      </div>
    </div>
  );
};

export default PaymentFlow;