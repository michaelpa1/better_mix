'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Icon from '@/components/ui/AppIcon';

interface UploadedFile {
  file: File;
  url: string;
}

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
  uploadedFile?: UploadedFile | null;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  uploadedFile
}) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
    setDragActive(false);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  if (uploadedFile) {
    return (
      <div className="studio-card studio-padding">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="MusicalNoteIcon" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">{uploadedFile.file.name}</h3>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-ghost text-sm"
          >
            Change File
          </button>
        </div>
        
        {/* Audio Preview */}
        <div className="mt-6">
          <audio
            controls
            src={uploadedFile.url}
            className="w-full"
            style={{ height: '40px' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-smooth
        ${isDragActive || dragActive
          ? 'border-primary bg-primary/5' :'border-white/[0.06] hover:border-primary/50'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon 
            name="CloudArrowUpIcon" 
            size={32} 
            className="text-primary"
          />
        </div>
        
        <div>
          <h3 className="text-xl font-medium text-foreground mb-2">
            Upload your audio file
          </h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop your file here or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supports MP3, WAV, FLAC, AAC, OGG • Max 100MB
          </p>
        </div>
        
        <button
          type="button"
          className="btn-primary"
        >
          Choose File
        </button>
      </div>
    </div>
  );
};