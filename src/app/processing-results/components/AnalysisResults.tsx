'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AnalysisData {
  overview: {
    duration: string;
    sampleRate: string;
    bitDepth: string;
    channels: string;
  };
  audioMetrics: {
    peakAmplitude: string;
    rmsLevel: string;
    dynamicRange: string;
    loudness: string;
    stereoWidth: string;
  };
  frequencyAnalysis: {
    lowFreq: string;
    midFreq: string;
    highFreq: string;
    spectralCentroid: string;
  };
  recommendations: string[];
}

interface AnalysisResultsProps {
  analysisData: AnalysisData;
  fileName: string;
}

const AnalysisResults = ({ analysisData, fileName }: AnalysisResultsProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const renderMetricCard = (label: string, value: string, icon: string, color: string = 'text-foreground') => (
    <div className="bg-muted/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon name={icon as any} size={16} className="text-muted-foreground" />
        <span className={`text-lg font-bold ${color}`}>{value}</span>
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );

  const renderSection = (title: string, sectionKey: string, content: React.ReactNode) => {
    const isExpanded = expandedSections.has(sectionKey);
    
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-smooth"
        >
          <h4 className="text-base font-semibold text-foreground">{title}</h4>
          <Icon 
            name={isExpanded ? "ChevronUpIcon" : "ChevronDownIcon"} 
            size={20} 
            className="text-muted-foreground"
          />
        </button>
        {isExpanded && (
          <div className="p-4 bg-card">
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="DocumentChartBarIcon" size={16} />
          <span>{fileName}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Overview Section */}
        {renderSection(
          'File Overview',
          'overview',
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {renderMetricCard('Duration', analysisData.overview.duration, 'ClockIcon')}
            {renderMetricCard('Sample Rate', analysisData.overview.sampleRate, 'SignalIcon')}
            {renderMetricCard('Bit Depth', analysisData.overview.bitDepth, 'CpuChipIcon')}
            {renderMetricCard('Channels', analysisData.overview.channels, 'SpeakerWaveIcon')}
          </div>
        )}

        {/* Audio Metrics Section */}
        {renderSection(
          'Audio Metrics',
          'metrics',
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderMetricCard('Peak Amplitude', analysisData.audioMetrics.peakAmplitude, 'ChartBarIcon', 'text-error')}
            {renderMetricCard('RMS Level', analysisData.audioMetrics.rmsLevel, 'SignalIcon', 'text-warning')}
            {renderMetricCard('Dynamic Range', analysisData.audioMetrics.dynamicRange, 'AdjustmentsHorizontalIcon', 'text-success')}
            {renderMetricCard('Loudness (LUFS)', analysisData.audioMetrics.loudness, 'SpeakerWaveIcon', 'text-primary')}
            {renderMetricCard('Stereo Width', analysisData.audioMetrics.stereoWidth, 'ArrowsRightLeftIcon', 'text-accent')}
          </div>
        )}

        {/* Frequency Analysis Section */}
        {renderSection(
          'Frequency Analysis',
          'frequency',
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderMetricCard('Low Freq (20-250Hz)', analysisData.frequencyAnalysis.lowFreq, 'ArrowTrendingDownIcon', 'text-error')}
              {renderMetricCard('Mid Freq (250Hz-4kHz)', analysisData.frequencyAnalysis.midFreq, 'MinusIcon', 'text-warning')}
              {renderMetricCard('High Freq (4kHz+)', analysisData.frequencyAnalysis.highFreq, 'ArrowTrendingUpIcon', 'text-success')}
              {renderMetricCard('Spectral Centroid', analysisData.frequencyAnalysis.spectralCentroid, 'ChartBarIcon', 'text-primary')}
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="ChartBarIcon" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Frequency Distribution</span>
              </div>
              <div className="flex items-end space-x-1 h-20">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-primary rounded-sm flex-1"
                    style={{ height: `${Math.random() * 80 + 10}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {renderSection(
          'Recommendations',
          'recommendations',
          <div className="space-y-3">
            {analysisData.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
                <Icon name="LightBulbIcon" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{recommendation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth">
            <Icon name="DocumentArrowDownIcon" size={16} />
            <span>Export JSON</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-smooth">
            <Icon name="DocumentTextIcon" size={16} />
            <span>Export PDF</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth">
            <Icon name="ShareIcon" size={16} />
            <span>Share Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;