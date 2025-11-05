import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import CreditManagementInteractive from './components/CreditManagementInteractive';

export const metadata: Metadata = {
  title: 'Credit Management - Better Mix',
  description: 'Manage your credit balance, view usage history, and purchase additional credits for professional audio processing services.',
};

export default function CreditManagementPage() {
  return (
    <>
      <Header creditBalance={950} />
      <CreditManagementInteractive />
    </>
  );
}