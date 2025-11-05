'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface WaveformComparisonProps {
  originalWaveform: number[];
  processedWaveform: number[];
  fileName: string;
}

const WaveformComparison = ({ originalWaveform, processedWaveform, fileName }: WaveformComparisonProps) => {
  const [activeView, setActiveView] = useState<'original' | 'processed' | 'comparison'>('comparison');

  const renderWaveform = (waveform: number[], color: string, label: string) => {
    const maxHeight = 60;
    const barWidth = 2;
    const gap = 1;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-xs text-muted-foreground">
              {waveform.length} samples
            </span>
          </div>
        </div>
        <div className="flex items-end justify-center h-16 bg-muted/30 rounded-lg p-2 overflow-hidden">
          {waveform.slice(0, 100).map((amplitude, index) => (
            <div
              key={index}
              className={`${color} rounded-sm`}
              style={{
                width: `${barWidth}px`,
                height: `${Math.max(2, amplitude * maxHeight)}px`,
                marginRight: `${gap}px`,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Waveform Analysis</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="ChartBarIcon" size={16} />
          <span>{fileName}</span>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center space-x-1 mb-6 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveView('original')}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
            activeView === 'original' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          Original
        </button>
        <button
          onClick={() => setActiveView('processed')}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
            activeView === 'processed' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          Processed
        </button>
        <button
          onClick={() => setActiveView('comparison')}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
            activeView === 'comparison' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          Compare
        </button>
      </div>

      {/* Waveform Display */}
      <div className="space-y-6">
        {activeView === 'original' && renderWaveform(originalWaveform, 'bg-secondary', 'Original Audio')}
        
        {activeView === 'processed' && renderWaveform(processedWaveform, 'bg-primary', 'Processed Audio')}
        
        {activeView === 'comparison' && (
          <div className="space-y-4">
            {renderWaveform(originalWaveform, 'bg-secondary', 'Original Audio')}
            {renderWaveform(processedWaveform, 'bg-primary', 'Enhanced Audio')}
          </div>
        )}
      </div>

      {/* Analysis Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">+12dB</div>
            <div className="text-sm text-muted-foreground">Peak Gain</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">-3.2dB</div>
            <div className="text-sm text-muted-foreground">RMS Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">85%</div>
            <div className="text-sm text-muted-foreground">Dynamic Range</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">-14 LUFS</div>
            <div className="text-sm text-muted-foreground">Loudness</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveformComparison;