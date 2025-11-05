import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProcessingHistoryInteractive from './components/ProcessingHistoryInteractive';

export const metadata: Metadata = {
  title: 'Processing History - Better Mix',
  description: 'Review and manage your audio processing jobs with comprehensive tracking, filtering, and re-access capabilities for all your enhanced content.',
};

export default function ProcessingHistoryPage() {
  return (
    <>
      <Header creditBalance={2450} />
      <ProcessingHistoryInteractive />
    </>
  );
}