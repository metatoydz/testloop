'use client';

import type { ResolvedResult } from '@/lib/scoring/contract';

interface ShareButtonsProps {
  result: ResolvedResult;
  url?: string;
}

export function ShareButtons({ result, url }: ShareButtonsProps) {
  const shareUrl =
    url ?? (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = result.view.shareText;

  const handleWebShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: result.view.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // 사용자가 취소한 경우 무시
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Web Share API 미지원 시 클립보드 복사
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('링크가 클립보드에 복사되었습니다!');
      } catch {
        alert('공유 기능을 사용할 수 없습니다.');
      }
    }
  };

  const handleKakaoShare = () => {
    // 카카오 SDK 준비 (추후 구현)
    // 현재는 Web Share API로 대체
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!kakaoKey) {
      handleWebShare();
      return;
    }
    // TODO: 카카오 SDK 초기화 및 공유 구현
    handleWebShare();
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
        onClick={handleWebShare}
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        <span className="text-lg">🔗</span>
        링크 공유하기
      </button>
    </div>
  );
}
