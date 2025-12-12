import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'AvePoint Elements Dashboard',
  description: 'Unified MSP view across AvePoint Elements customers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slateInk text-slate-100 antialiased`}>{children}</body>
    </html>
  );
}
