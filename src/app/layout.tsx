import '../styles/index.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Better Mix',
  description: 'Polish your sound with clean, calm audio enhancement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* Leaving the Rocket runtime in place for now so nothing breaks. 
            We can remove this later once the layout is stable. */}
      
      <script type="module" src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fbettermix8835back.builtwithrocket.new&_be=https%3A%2F%2Fapplication.rocket.new&_v=0.1.9" />
      <script type="module" src="https://static.rocket.new/rocket-shot.js?v=0.0.1" /></body>
    </html>
  );
}
