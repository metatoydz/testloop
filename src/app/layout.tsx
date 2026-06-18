import type { Metadata } from 'next';
import { KakaoInit } from '@/components/KakaoInit';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TestLoop',
    template: '%s | TestLoop',
  },
  description: '나를 알아가는 재미있는 테스트들',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <KakaoInit />
      </body>
    </html>
  );
}
