import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProcessingStatusInteractive from './components/ProcessingStatusInteractive';

export const metadata: Metadata = {
  title: 'Processing Status - Better Mix',
  description: 'Monitor real-time progress of your audio enhancement requests with clear visual feedback and estimated completion times.',
};

export default function ProcessingStatusPage() {
  return (
    <>
      <Header 
        creditBalance={2450}
        isProcessing={true}
        processingProgress={67}
      />
      <ProcessingStatusInteractive />
    </>
  );
}