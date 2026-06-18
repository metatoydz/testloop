import type { Metadata } from 'next';
import Script from 'next/script';
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
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
          strategy="afterInteractive"
          onLoad={() => {
            const w = window as Window & { Kakao?: { isInitialized: () => boolean; init: (key: string) => void } };
            if (w.Kakao && !w.Kakao.isInitialized()) {
              w.Kakao.init('b6e1b334434f10c615cd0027d4ff9d6e');
            }
          }}
        />
      </body>
    </html>
  );
}
