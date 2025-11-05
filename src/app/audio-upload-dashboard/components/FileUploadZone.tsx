'use client';
import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FileUploadZoneProps {
  onSelect: (file: File) => void;
}

export default function FileUploadZone({ onSelect }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => 
      file.type.startsWith('audio/') || 
      ['.wav', '.flac', '.mp3'].some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (audioFile) {
      onSelect(audioFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`studio-card studio-padding cursor-pointer transition-all duration-300 border-2 border-dashed text-center ${
          isDragOver 
            ? 'border-primary bg-primary/5 scale-105' :'border-white/[0.06] hover:border-primary/50 hover:bg-primary/5'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {/* Simple Upload Cloud Icon in Cyan */}
        <div className="mb-6">
          <div className={`w-20 h-20 mx-auto text-primary transition-transform duration-300 ${
            isDragOver ? 'scale-110' : ''
          }`}>
            <Icon name="CloudArrowUpIcon" size={80} />
          </div>
        </div>

        {/* Upload Text in Calm Tone */}
        <div className="space-y-4">
          <h3 className="text-2xl font-medium text-foreground">
            Upload your audio file
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Drag and drop your WAV, FLAC, or MP3 file here
          </p>
          <div className="pt-4">
            <span className="text-primary font-medium hover:underline">
              Or click to browse files
            </span>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-muted rounded-lg">WAV</span>
            <span className="px-3 py-1 bg-muted rounded-lg">FLAC</span>
            <span className="px-3 py-1 bg-muted rounded-lg">MP3</span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".wav,.flac,.mp3,audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}