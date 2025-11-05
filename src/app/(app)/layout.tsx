'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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

  // Listen for settings open events
  useEffect(() => {
    const handleOpenSettings = () => setIsSettingsOpen(true);
    window.addEventListener('openSettings', handleOpenSettings);
    return () => window.removeEventListener('openSettings', handleOpenSettings);
  }, []);

  const sidebarItems = [
    { label: 'Home', path: '/', icon: 'HomeIcon' },
    { label: 'Upload', path: '/upload', icon: 'CloudArrowUpIcon' },
    { label: 'Results', path: '/results', icon: 'CheckCircleIcon' },
    { label: 'History', path: '/history', icon: 'DocumentTextIcon' },
    { label: 'Admin', path: '/admin', icon: 'CogIcon' },
  ];

  const isActive = (path: string) => pathname === path || (pathname === '/audio-upload-dashboard' && path === '/upload');

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
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
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Thin Vertical Navigation Rail - Desktop */}
      <aside className="hidden lg:flex nav-rail">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-rail-item ${isActive(item.path) ? 'active' : ''}`}
            title={item.label}
          >
            <Icon name={item.icon as any} size={20} />
          </Link>
        ))}
      </aside>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleMobileSidebar} />
          <div className="fixed top-0 left-0 w-64 h-full studio-card shadow-xl">
            <div className="flex items-center justify-between h-16 px-6 border-b border-white/[0.06]">
              <span className="text-xl font-semibold text-foreground">Better Mix</span>
              <button
                onClick={toggleMobileSidebar}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>
            <nav className="px-4 py-6 space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={toggleMobileSidebar}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-xl text-sm font-medium transition-smooth ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Clean Horizontal Header Bar */}
        <header className="bg-card border-b border-white/[0.06] h-16 flex items-center justify-between studio-padding">
          {/* Left side: Mobile menu + Title */}
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
            >
              <Icon name="Bars3Icon" size={20} />
            </button>
            
            <h1 className="text-2xl font-bold text-foreground">Better Mix</h1>
          </div>

          {/* Right side: Mode pill + Settings */}
          <div className="flex items-center space-x-6">
            {/* Mode Pill */}
            <div className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              mode === 'Prod' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                : mode === 'Mock'? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :'bg-green-500/10 text-green-400 border-green-500/20'
            }`}>
              {mode}
            </div>

            {/* Settings Button */}
            <button
              onClick={toggleSettings}
              className="p-3 rounded-lg hover:bg-muted transition-smooth"
              title="Settings"
            >
              <Icon name="Cog6ToothIcon" size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Settings Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleSettings} />
          <div className="fixed top-0 right-0 w-96 h-full studio-card shadow-xl border-l border-white/[0.06]">
            <div className="studio-padding border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
                <button
                  onClick={toggleSettings}
                  className="p-2 rounded-lg hover:bg-muted transition-smooth"
                >
                  <Icon name="XMarkIcon" size={20} />
                </button>
              </div>
            </div>

            <div className="studio-padding space-y-8">
              {/* API Base URL */}
              <div className="space-y-3">
                <label className="text-base font-medium text-foreground">API Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => handleBaseUrlChange(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="w-full px-4 py-3 bg-input border border-white/[0.06] rounded-xl text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  API endpoint for all requests. Saved automatically.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="space-y-3">
                <label className="text-base font-medium text-foreground">Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Dev', 'Prod', 'Mock'] as const).map((modeOption) => (
                    <button
                      key={modeOption}
                      onClick={() => handleModeChange(modeOption)}
                      className={`px-4 py-3 text-sm font-medium rounded-xl transition-smooth ${
                        mode === modeOption
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {modeOption}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {mode === 'Dev' && 'Development mode with X-BetterMix-Mode: dev header'}
                  {mode === 'Prod' && 'Production mode with X-BetterMix-Mode: prod header'}
                  {mode === 'Mock' && 'Mock mode with fake responses for testing'}
                </div>
              </div>

              {/* Current Settings Info */}
              <div className="studio-card studio-padding">
                <h3 className="text-lg font-medium text-foreground mb-4">Current Configuration</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Base URL:</span>
                    <span className="text-foreground font-mono text-right break-all ml-4">{baseUrl || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Mode:</span>
                    <span className={`font-medium ${
                      mode === 'Prod' ? 'text-orange-400' : 
                      mode === 'Mock' ? 'text-blue-400' : 'text-green-400'
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
    </div>
  );
};

export default AppLayout;