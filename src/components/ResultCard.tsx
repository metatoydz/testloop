'use client';

import type { ResolvedResult } from '@/lib/scoring/contract';

// 참교육 유형별 카드 스타일
const CARD_STYLES: Record<string, { bg: string; text: string; border: string; emoji: string; no: string }> = {
  late:    { bg: '#FFD23F', text: '#181818', border: '#181818', emoji: '⏰', no: 'No.01' },
  myway:   { bg: '#E8332E', text: '#FFFFFF', border: '#FFFFFF', emoji: '💬', no: 'No.02' },
  mbti:    { bg: '#5B4CF5', text: '#FFFFFF', border: '#C4B5FD', emoji: '🔮', no: 'No.03' },
  plan:    { bg: '#1A73E8', text: '#FFFFFF', border: '#93C5FD', emoji: '📋', no: 'No.04' },
  night:   { bg: '#1A1A2E', text: '#E2E8F0', border: '#4B5563', emoji: '🌙', no: 'No.05' },
  talk:    { bg: '#F97316', text: '#FFFFFF', border: '#FFFFFF', emoji: '🎤', no: 'No.06' },
  taste:   { bg: '#16A34A', text: '#FFFFFF', border: '#BBF7D0', emoji: '🍽️', no: 'No.07' },
  ghost:   { bg: '#374151', text: '#D1D5DB', border: '#6B7280', emoji: '👻', no: 'No.08' },
};

const DEFAULT_STYLE = { bg: '#6366F1', text: '#FFFFFF', border: '#A5B4FC', emoji: '🎯', no: '' };

interface ResultCardProps {
  result: ResolvedResult;
  summary?: string;
}

export function ResultCard({ result, summary }: ResultCardProps) {
  const { view, display } = result;
  const typeKey = display?.typeKey ?? result.resultId;
  const style = CARD_STYLES[typeKey] ?? DEFAULT_STYLE;

  return (
    <div
      className="w-full max-w-md mx-auto rounded-2xl shadow-xl overflow-hidden"
      style={{ background: style.bg, border: `3px solid ${style.border}` }}
    >
      {/* 상단 라벨 */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: style.text, color: style.bg, opacity: 0.9 }}
        >
          참교육 진단서 {style.no}
        </span>
        <span className="text-3xl">{style.emoji}</span>
      </div>

      {/* 유형명 */}
      <div className="px-6 pb-2">
        <h2
          className="text-3xl font-black leading-tight"
          style={{ color: style.text }}
        >
          {view.title}
        </h2>
      </div>

      {/* 요약(펀치라인) */}
      {summary && (
        <div
          className="mx-6 mb-4 px-4 py-3 rounded-xl text-sm font-semibold"
          style={{ background: `${style.text}20`, color: style.text }}
        >
          💡 {summary}
        </div>
      )}

      {/* 구분선 */}
      <div className="mx-6 mb-4" style={{ borderTop: `1px solid ${style.border}40` }} />

      {/* 설명 */}
      <div className="px-6 pb-6">
        <p
          className="text-sm leading-relaxed whitespace-pre-line"
          style={{ color: style.text, opacity: 0.9 }}
        >
          {view.description}
        </p>
      </div>
    </div>
  );
}
