import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import FAB from '@/components/FAB';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Trippy'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geist.variable} font-sans antialiased`}>
        <main className="pb-20 min-h-screen">
          {children}
        </main>
        <BottomNav />
        <FAB />
      </body>
    </html>
  );
}
