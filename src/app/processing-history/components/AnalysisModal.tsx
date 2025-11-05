'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface AnalysisData {
  overall_score: number;
  frequency_analysis: {
    bass_level: number;
    mid_level: number;
    treble_level: number;
    balance_score: number;
  };
  dynamics: {
    peak_level: number;
    rms_level: number;
    dynamic_range: number;
    loudness_lufs: number;
  };
  recommendations: string[];
  technical_details: {
    sample_rate: number;
    bit_depth: number;
    duration: number;
    channels: number;
  };
}

interface ProcessingJob {
  id: string;
  filename: string;
  serviceType: string;
  analysisData?: AnalysisData;
}

interface AnalysisModalProps {
  job: ProcessingJob | null;
  isOpen: boolean;
  onClose: () => void;
}

const AnalysisModal = ({ job, isOpen, onClose }: AnalysisModalProps) => {
  if (!isOpen || !job || !job.analysisData) return null;

  const analysis = job.analysisData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Analysis Results</h2>
            <p className="text-sm text-muted-foreground mt-1">{job.filename}</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Overall Score */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className={`flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(analysis.overall_score)}`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                    {analysis.overall_score}
                  </div>
                  <div className="text-xs text-muted-foreground">Overall</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Frequency Analysis */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="ChartBarIcon" size={20} className="mr-2" />
                Frequency Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bass Level</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${analysis.frequency_analysis.bass_level}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-foreground w-8">
                      {analysis.frequency_analysis.bass_level}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mid Level</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${analysis.frequency_analysis.mid_level}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-foreground w-8">
                      {analysis.frequency_analysis.mid_level}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Treble Level</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${analysis.frequency_analysis.treble_level}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-foreground w-8">
                      {analysis.frequency_analysis.treble_level}%
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Balance Score</span>
                    <span className={`text-sm font-bold ${getScoreColor(analysis.frequency_analysis.balance_score)}`}>
                      {analysis.frequency_analysis.balance_score}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamics */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="SpeakerWaveIcon" size={20} className="mr-2" />
                Dynamics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Peak Level</span>
                  <span className="text-sm font-mono text-foreground">
                    {analysis.dynamics.peak_level.toFixed(1)} dB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">RMS Level</span>
                  <span className="text-sm font-mono text-foreground">
                    {analysis.dynamics.rms_level.toFixed(1)} dB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dynamic Range</span>
                  <span className="text-sm font-mono text-foreground">
                    {analysis.dynamics.dynamic_range.toFixed(1)} dB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Loudness (LUFS)</span>
                  <span className="text-sm font-mono text-foreground">
                    {analysis.dynamics.loudness_lufs.toFixed(1)} LUFS
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Cog6ToothIcon" size={20} className="mr-2" />
                Technical Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sample Rate</span>
                  <span className="text-sm font-mono text-foreground">
                    {analysis.technical_details.sample_rate.toLocaleString()} Hz
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bit Depth</span>
                  <span className="text-sm font-mono text-foreground">
                    {analysis.technical_details.bit_depth} bit
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-mono text-foreground">
                    {formatDuration(analysis.technical_details.duration)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Channels</span>
                  <span className="text-sm font-mono text-foreground">
                    {analysis.technical_details.channels === 2 ? 'Stereo' : 'Mono'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="LightBulbIcon" size={20} className="mr-2" />
                Recommendations
              </h3>
              <div className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Icon name="CheckCircleIcon" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
          >
            Close
          </button>
          <button
            onClick={() => {
              const dataStr = JSON.stringify(analysis, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${job.filename}_analysis.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
          >
            <Icon name="DocumentArrowDownIcon" size={16} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;