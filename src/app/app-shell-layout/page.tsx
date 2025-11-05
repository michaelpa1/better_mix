'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function AppShellLayoutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              App Shell Layout
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The App Shell Layout provides the persistent structural foundation for the Better Mix application, 
              featuring a responsive header and collapsible sidebar navigation optimized for audio production workflows.
            </p>
          </div>

          {/* Layout Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Header Features */}
            <div className="studio-card studio-padding">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Icon name="Bars3BottomLeftIcon" size={24} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Responsive Header</h2>
              </div>
              
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Better Mix logo with consistent branding</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Real-time mode indicator pill (Dev, Prod, Mock)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Settings drawer with API configuration</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Sidebar toggle for enhanced navigation control</span>
                </li>
              </ul>
            </div>

            {/* Sidebar Features */}
            <div className="studio-card studio-padding">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Icon name="QueueListIcon" size={24} className="text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Collapsible Sidebar</h2>
              </div>
              
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Primary navigation with iconography</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Active state indicators with visual feedback</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Mobile-responsive overlay behavior</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Smooth transitions and hover states</span>
                </li>
              </ul>
            </div>

            {/* Navigation Links */}
            <div className="studio-card studio-padding">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <Icon name="MapIcon" size={24} className="text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Navigation Routes</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { route: '/', name: 'Home', desc: 'Landing page and workflow overview' },
                  { route: '/upload', name: 'Upload', desc: 'Audio file upload wizard' },
                  { route: '/results', name: 'Results', desc: 'Processing results and downloads' },
                  { route: '/history', name: 'History', desc: 'Processing history and analytics' },
                  { route: '/admin', name: 'Admin', desc: 'Administrative controls and settings' }
                ]?.map((item) => (
                  <div key={item?.route} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
                    <div>
                      <span className="font-mono text-sm text-primary">{item?.route}</span>
                      <span className="mx-2 text-muted-foreground">→</span>
                      <span className="font-medium text-foreground">{item?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Theme & Experience */}
            <div className="studio-card studio-padding">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center">
                  <Icon name="SwatchIcon" size={24} className="text-warning" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Dark Studio Theme</h2>
              </div>
              
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Professional atmosphere for extended use</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>High-contrast text for optimal readability</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Subtle purple accents with audio-focused cues</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                  <span>Reduced cognitive load during workflows</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Performance & Accessibility */}
          <div className="mt-8">
            <div className="studio-card studio-padding">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
                  <Icon name="BoltIcon" size={24} className="text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Performance & Accessibility</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Performance Features</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start space-x-3">
                      <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                      <span>Loading states and error boundaries</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                      <span>Graceful content transitions</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                      <span>Optimized for complex audio workflows</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Responsive Design</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start space-x-3">
                      <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                      <span>Seamless adaptation across devices</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                      <span>Touch-optimized mobile interactions</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Icon name="CheckIcon" size={16} className="text-success mt-1 flex-shrink-0" />
                      <span>Navigation accessibility maintained</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}