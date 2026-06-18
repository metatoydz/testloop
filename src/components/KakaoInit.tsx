'use client';

import Script from 'next/script';

export function KakaoInit() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        const w = window as Window & {
          Kakao?: { isInitialized: () => boolean; init: (key: string) => void };
        };
        if (w.Kakao && !w.Kakao.isInitialized()) {
          w.Kakao.init('b6e1b334434f10c615cd0027d4ff9d6e');
        }
      }}
    />
  );
}
