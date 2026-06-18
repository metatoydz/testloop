'use client';

import type { ResolvedResult } from '@/lib/scoring/contract';
import { useState } from 'react';

interface ShareButtonsProps {
  result: ResolvedResult;
  url?: string;
}

export function ShareButtons({ result, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = result.view.shareText;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKakaoShare = () => {
    // 카카오 SDK가 로드됐는지 확인
    const w = window as Window & { Kakao?: { Share?: { sendDefault: (opts: unknown) => void } } };
    if (w.Kakao?.Share) {
      w.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: result.view.title,
          description: shareText,
          imageUrl: `https://testloop-alpha.vercel.app/api/og?slug=${encodeURIComponent(shareUrl.split('/test/')[1]?.split('/result/')[0] ?? '')}&rid=${encodeURIComponent(shareUrl.split('/result/')[1] ?? '')}`,
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [{ title: '결과 보기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
      });
    } else {
      // 카카오 SDK 없으면 Web Share API
      if (navigator.share) {
        navigator.share({ title: result.view.title, text: shareText, url: shareUrl });
      } else {
        copyToClipboard();
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto px-4">
      <button
        onClick={handleKakaoShare}
        className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        <span className="text-lg">💬</span>
        카카오톡으로 공유하기
      </button>
      <button
        onClick={copyToClipboard}
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        <span className="text-lg">{copied ? '✅' : '🔗'}</span>
        {copied ? '링크 복사됨!' : '링크 복사하기'}
      </button>
    </div>
  );
}
