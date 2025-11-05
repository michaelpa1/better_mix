'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface HeaderProps {
  creditBalance?: number;
  isProcessing?: boolean;
  processingProgress?: number;
}

const Header = ({ creditBalance = 0, isProcessing = false, processingProgress = 0 }: HeaderProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [mode, setMode] = useState<'Dev' | 'Prod' | 'Mock'>('Dev');

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedBaseUrl = localStorage.getItem('bettermix:baseUrl') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const storedMode = (localStorage.getItem('bettermix:mode') || 'Dev') as 'Dev' | 'Prod' | 'Mock';
    setBaseUrl(storedBaseUrl);
    setMode(storedMode);
  }, []);

  const navigationItems = [
    { label: 'Upload', path: '/audio-upload-dashboard', icon: 'CloudArrowUpIcon' },
    { label: 'Status', path: '/processing-status', icon: 'ClockIcon' },
    { label: 'Results', path: '/processing-results', icon: 'CheckCircleIcon' },
    { label: 'History', path: '/processing-history', icon: 'DocumentTextIcon' },
  ];

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleBaseUrlChange = (value: string) => {
    setBaseUrl(value);
    localStorage.setItem('bettermix:baseUrl', value);
  };

  const handleModeChange = (value: 'Dev' | 'Prod' | 'Mock') => {
    setMode(value);
    localStorage.setItem('bettermix:mode', value);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link href="/audio-upload-dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-primary-foreground"
                fill="currentColor"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-foreground">Better Mix</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth hover:bg-muted ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={item.icon as any} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Credit Balance, Settings & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Credit Balance Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-lg">
              <Icon name="CurrencyDollarIcon" size={16} className="text-muted-foreground" />
              <span className="text-sm font-mono font-medium text-foreground">
                {creditBalance.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">credits</span>
            </div>

            {/* Settings Button */}
            <button
              onClick={toggleSettings}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-smooth"
              title="Settings"
            >
              <Icon name="Cog6ToothIcon" size={20} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-smooth"
            >
              <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={20} />
            </button>
          </div>
        </div>

        {/* Processing Progress Indicator */}
        {isProcessing && (
          <div className="bg-accent/10 border-t border-accent/20">
            <div className="px-6 py-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse-gentle">
                    <Icon name="Cog6ToothIcon" size={16} className="text-accent" />
                  </div>
                  <span className="text-accent font-medium">Processing audio...</span>
                </div>
                <span className="text-accent font-mono">{processingProgress}%</span>
              </div>
              <div className="mt-1 w-full bg-accent/20 rounded-full h-1">
                <div
                  className="bg-accent h-1 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Settings Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleSettings} />
          <div className="fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] bg-card border-l border-border shadow-xl">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Settings</h2>
                <button
                  onClick={toggleSettings}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-smooth"
                >
                  <Icon name="XMarkIcon" size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* API Base URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">API Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => handleBaseUrlChange(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">
                  API endpoint for all requests. Saved automatically.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Dev', 'Prod', 'Mock'] as const).map((modeOption) => (
                    <button
                      key={modeOption}
                      onClick={() => handleModeChange(modeOption)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-smooth ${
                        mode === modeOption
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {modeOption}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {mode === 'Dev' && 'Development mode with X-BetterMix-Mode: dev header'}
                  {mode === 'Prod' && 'Production mode with X-BetterMix-Mode: prod header'}
                  {mode === 'Mock' && 'Mock mode with fake responses for testing'}
                </div>
              </div>

              {/* Current Settings Info */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h3 className="text-sm font-medium text-foreground">Current Configuration</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base URL:</span>
                    <span className="text-foreground font-mono">{baseUrl || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mode:</span>
                    <span className={`font-medium ${
                      mode === 'Prod' ? 'text-orange-500' : 
                      mode === 'Mock' ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {mode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleMobileMenu} />
          <div className="fixed top-16 left-0 right-0 bg-card border-b border-border shadow-lg">
            <nav className="px-6 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={toggleMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-smooth ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item.icon as any} size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;