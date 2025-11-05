import type { Metadata } from 'next';
import AudioUploadInteractive from './components/AudioUploadInteractive';

export const metadata: Metadata = {
  title: 'Audio Upload Dashboard - Better Mix',
  description: 'Upload your audio files and enhance them with professional AI-powered mastering, mix enhancement, and analysis services.',
};

export default function AudioUploadDashboardPage() {
  return <AudioUploadInteractive />;
}