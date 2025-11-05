import type { Metadata } from 'next';
import UploadWizard from './components/UploadWizard';

export const metadata: Metadata = {
  title: 'Upload - Better Mix',
  description: 'Upload your audio files and enhance them with professional AI-powered mastering, mix enhancement, and analysis services.',
};

export default function UploadPage() {
  return <UploadWizard />;
}