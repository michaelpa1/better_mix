'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ABPlayer from '@/components/ABPlayer';

export default function HomePage() {
  const [activeGenreTab, setActiveGenreTab] = useState('acoustic');

  const handleHearDemo = () => {
    document.getElementById('signature-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const genreDemos = {
    acoustic: {
      before: 'https://cdn.example.com/demos/acoustic_before.mp3',
      after: 'https://cdn.example.com/demos/acoustic_after.mp3'
    },
    electronic: {
      before: 'https://cdn.example.com/demos/electronic_before.mp3',
      after: 'https://cdn.example.com/demos/electronic_after.mp3'
    },
    voice: {
      before: 'https://cdn.example.com/demos/voice_before.mp3',
      after: 'https://cdn.example.com/demos/voice_after.mp3'
    }
  };

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section 
        className="py-32 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(196,232,255,0.08), rgba(255,208,234,0.06)), linear-gradient(180deg, #0b0d10, #141821)'
        }}
      >
        <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
          <h1 className="text-7xl md:text-8xl font-bold text-foreground mb-8 leading-tight tracking-tight">
            Better Mix
          </h1>
          <p className="text-2xl text-muted-foreground mb-16 leading-relaxed font-normal max-w-2xl mx-auto">
            Polish your sound with calm, clear tools. Upload, listen, and feel the upgrade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/upload"
              className="btn-primary text-xl px-8 py-4"
            >
              Start Free Preview
            </Link>
            <button
              onClick={handleHearDemo}
              className="btn-ghost text-xl px-8 py-4"
            >
              Hear a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Signature Demo */}
      <section id="signature-demo" className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="studio-card studio-padding">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Before and After</h2>
            
            <ABPlayer
              beforeUrl="https://cdn.example.com/demos/acoustic_before.mp3"
              afterUrl="https://cdn.example.com/demos/acoustic_after.mp3"
            />
            
            <p className="text-sm text-muted-foreground text-center mt-6">
              Best on headphones
            </p>
          </div>
        </div>
      </section>

      {/* Three Capability Panels */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mix Analysis */}
            <div className="studio-card studio-padding text-center">
              <div className="w-16 h-16 mx-auto mb-6 text-primary">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                  <rect x="8" y="40" width="4" height="16" fill="currentColor" rx="2"/>
                  <rect x="16" y="32" width="4" height="24" fill="currentColor" rx="2"/>
                  <rect x="24" y="20" width="4" height="36" fill="currentColor" rx="2"/>
                  <rect x="32" y="28" width="4" height="28" fill="currentColor" rx="2"/>
                  <rect x="40" y="36" width="4" height="20" fill="currentColor" rx="2"/>
                  <rect x="48" y="24" width="4" height="32" fill="currentColor" rx="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-4">Mix Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find mud, mask, and sharp spots. Get clear, simple guidance.
              </p>
            </div>

            {/* Stem Enhancement */}
            <div className="studio-card studio-padding text-center">
              <div className="w-16 h-16 mx-auto mb-6 text-primary">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                  <path d="M8 32 L24 20 L40 36 L56 24" stroke="currentColor" strokeWidth="3" fill="none"/>
                  <path d="M8 40 L24 28 L40 44 L56 32" stroke="currentColor" strokeWidth="3" fill="none"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-4">Stem Enhancement</h3>
              <p className="text-muted-foreground leading-relaxed">
                Separate vocal, bass, drums. Bring out detail without artifacts.
              </p>
            </div>

            {/* Mastering */}
            <div className="studio-card studio-padding text-center">
              <div className="w-16 h-16 mx-auto mb-6 text-primary">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                  <path d="M8 48 Q32 16 56 48" stroke="currentColor" strokeWidth="3" fill="none"/>
                  <circle cx="32" cy="32" r="3" fill="currentColor"/>
                  <circle cx="16" cy="42" r="2" fill="currentColor"/>
                  <circle cx="48" cy="42" r="2" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-4">Mastering</h3>
              <p className="text-muted-foreground leading-relaxed">
                Loudness, clarity, width. A clean, release ready sound.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Genre Demos with Tabs */}
      <section id="genre-demos" className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="studio-card studio-padding">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Genre Examples</h2>
            
            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-muted rounded-lg p-1 inline-flex">
                {Object.keys(genreDemos).map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setActiveGenreTab(genre)}
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-smooth capitalize ${
                      activeGenreTab === genre
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Genre Demo */}
            <ABPlayer
              beforeUrl={genreDemos[activeGenreTab as keyof typeof genreDemos].before}
              afterUrl={genreDemos[activeGenreTab as keyof typeof genreDemos].after}
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-foreground mb-16 text-center">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-4">Upload</h3>
              <p className="text-muted-foreground leading-relaxed">
                WAV, FLAC, MP3
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-4">Choose service</h3>
              <p className="text-muted-foreground leading-relaxed">
                Mastering preview, Enhance preview, or Analysis
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-4">Review</h3>
              <p className="text-muted-foreground leading-relaxed">
                Download result or view JSON
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              You stay in control. Files are yours.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <div className="studio-card studio-padding">
            <h2 className="text-3xl font-bold text-foreground mb-8">Ready when you are</h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-6">
              <Link
                href="/upload"
                className="btn-primary text-lg"
              >
                Start Free Preview
              </Link>
              <Link
                href="/history"
                className="btn-ghost text-lg"
              >
                View History
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              No account required for previews
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-lg font-medium text-foreground mb-4 md:mb-0">
              Better Mix
            </div>
            <div className="flex space-x-8 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-smooth">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-smooth">
                Terms
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-smooth">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}