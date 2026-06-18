'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TestPlayer } from '@/components/TestPlayer';
import type { RawAnswer, TestContent } from '@/lib/scoring/contract';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function PlayPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();
  const [content, setContent] = useState<TestContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/content/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data: TestContent) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  const handleComplete = async (answers: RawAnswer[]) => {
    try {
      const res = await fetch(`/api/score/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error('Score failed');
      const result = await res.json();
      router.push(`/test/${slug}/result/${result.resultId}`);
    } catch (err) {
      console.error('Failed to score:', err);
      // fallback: 폴백 결과 ID로 이동
      if (content?.fallbackResultId) {
        router.push(`/test/${slug}/result/${content.fallbackResultId}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-3">⏳</div>
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="text-4xl mb-3">😢</div>
          <p className="text-gray-600 font-semibold mb-2">테스트를 찾을 수 없어요</p>
          <a href="/" className="text-indigo-600 hover:underline text-sm">
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return <TestPlayer questions={content.questions} onComplete={handleComplete} />;
}
