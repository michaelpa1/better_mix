'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface DownloadOption {
  format: string;
  quality: string;
  size: string;
  downloadUrl: string;
}

interface DownloadOptionsProps {
  downloadOptions: DownloadOption[];
  expirationTime: string;
  fileName: string;
}

const DownloadOptions = ({ downloadOptions, expirationTime, fileName }: DownloadOptionsProps) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const expiration = new Date(expirationTime).getTime();
      const difference = expiration - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining('Expired');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expirationTime, isHydrated]);

  const handleDownload = (downloadUrl: string, format: string) => {
    // In a real app, this would trigger the download
    console.log(`Downloading ${fileName} in ${format} format from ${downloadUrl}`);
  };

  const handleEmailSend = () => {
    if (emailAddress) {
      setIsEmailSent(true);
      setTimeout(() => setIsEmailSent(false), 3000);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'wav': return 'MusicalNoteIcon';
      case 'flac': return 'DocumentIcon';
      case 'mp3': return 'SpeakerWaveIcon';
      default: return 'DocumentArrowDownIcon';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'lossless': return 'text-success';
      case 'high': return 'text-primary';
      case 'standard': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Download Options</h3>
        <div className="flex items-center space-x-2">
          <Icon name="ClockIcon" size={16} className="text-warning" />
          <span className="text-sm font-medium text-warning">
            Expires in {timeRemaining}
          </span>
        </div>
      </div>

      {/* Download Formats */}
      <div className="space-y-3 mb-6">
        {downloadOptions.map((option, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-smooth">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name={getFormatIcon(option.format) as any} size={20} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">{option.format.toUpperCase()}</span>
                  <span className={`text-sm font-medium ${getQualityColor(option.quality)}`}>
                    {option.quality}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">{option.size}</div>
              </div>
            </div>
            <button
              onClick={() => handleDownload(option.downloadUrl, option.format)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
            >
              <Icon name="ArrowDownTrayIcon" size={16} />
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>

      {/* Bulk Download */}
      <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="ArchiveBoxIcon" size={20} className="text-accent" />
            <div>
              <div className="font-medium text-foreground">Download All Formats</div>
              <div className="text-sm text-muted-foreground">ZIP archive with all available formats</div>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-smooth">
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span>Download ZIP</span>
          </button>
        </div>
      </div>

      {/* Email Delivery */}
      <div className="border-t border-border pt-6">
        <h4 className="text-base font-semibold text-foreground mb-4">Email Delivery</h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              placeholder="Enter your email address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={handleEmailSend}
            disabled={!emailAddress || isEmailSent}
            className="flex items-center justify-center space-x-2 px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name={isEmailSent ? "CheckIcon" : "EnvelopeIcon"} size={16} />
            <span>{isEmailSent ? 'Sent!' : 'Send Links'}</span>
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Download links will be sent to your email and remain valid for 24 hours.
        </p>
      </div>

      {/* Expiration Warning */}
      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="ExclamationTriangleIcon" size={20} className="text-warning mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-foreground">Download Reminder</div>
            <div className="text-sm text-muted-foreground mt-1">
              These download links will expire in {timeRemaining}. Make sure to download your files or send them to your email before they expire.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptions;