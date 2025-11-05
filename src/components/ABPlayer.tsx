'use client';

import React, { useState } from 'react';

interface ABPlayerProps {
  beforeUrl: string;
  afterUrl: string;
  label?: string;
  startAfter?: boolean;
}

const ABPlayer = ({ beforeUrl, afterUrl, label, startAfter = false }: ABPlayerProps) => {
  const [isAfter, setIsAfter] = useState(startAfter);
  const [currentSrc, setCurrentSrc] = useState(startAfter ? afterUrl : beforeUrl);

  const handleToggle = () => {
    const newIsAfter = !isAfter;
    setIsAfter(newIsAfter);
    setCurrentSrc(newIsAfter ? afterUrl : beforeUrl);
  };

  return (
    <div className="space-y-4">
      {label && (
        <h3 className="text-lg font-medium text-foreground text-center">{label}</h3>
      )}
      
      {/* Toggle Controls */}
      <div className="flex items-center justify-center space-x-6">
        <span className={`text-sm font-medium ${!isAfter ? 'text-foreground' : 'text-muted-foreground'}`}>
          Before
        </span>
        
        <button
          onClick={handleToggle}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          style={{ backgroundColor: isAfter ? '#38bdf8' : '' }}
        >
          <span className="sr-only">Toggle before/after</span>
          <span
            className={`${
              isAfter ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-background transition`}
          />
        </button>
        
        <span className={`text-sm font-medium ${isAfter ? 'text-foreground' : 'text-muted-foreground'}`}>
          After
        </span>
      </div>

      {/* Audio Player */}
      <div className="flex justify-center">
        <audio 
          controls 
          src={currentSrc}
          className="w-full max-w-md"
          key={currentSrc} // Force re-render when src changes
        >
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default ABPlayer;