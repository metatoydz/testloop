export const runtime = 'edge';

import { ImageResponse } from 'next/og';
import chamgyoyukData from '../../../../content/chamgyoyuk.json';

const CARD: Record<string, { bg: string; ink: string; accent: string; name: string; tagline: string; no: string }> = {
  late:    { bg: '#FFD23F', ink: '#181818', accent: '#181818', name: '곧도착러',        tagline: '지각계의 큰손',         no: '01' },
  myway:   { bg: '#E8332E', ink: '#FFFFFF', accent: '#FFAAAA', name: '답정너 종결자',   tagline: '근데 내 말이 맞잖아',   no: '02' },
  mbti:    { bg: '#5B4CF5', ink: '#FFFFFF', accent: '#C4B5FD', name: 'MBTI 과몰입러',  tagline: '그건 네가 F라서 그래',  no: '03' },
  plan:    { bg: '#1A73E8', ink: '#FFFFFF', accent: '#93C5FD', name: '내일부터 진짜',   tagline: '계획만 인간',           no: '04' },
  night:   { bg: '#1A1A2E', ink: '#E2E8F0', accent: '#818CF8', name: '자니? 새벽감성', tagline: '새벽 2시만 되면 시인',  no: '05' },
  talk:    { bg: '#F97316', ink: '#FFFFFF', accent: '#FED7AA', name: '아 그거 나도',    tagline: '대화 강탈범',           no: '06' },
  taste:   { bg: '#16A34A', ink: '#FFFFFF', accent: '#BBF7D0', name: '부먹찍먹 원칙',  tagline: '취향 강요반',           no: '07' },
  ghost:   { bg: '#374151', ink: '#D1D5DB', accent: '#6B7280', name: '어 봤는데 까먹음', tagline: '읽씹 장인',           no: '08' },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';
  const rid = searchParams.get('rid') ?? '';

  // content/*.json은 fs로 읽으면 Vercel에서 실패 → 정적 import 사용
  const contentMap: Record<string, { results: Array<{ id: string; title: string; summary?: string }> }> = {
    chamgyoyuk: chamgyoyukData as { results: Array<{ id: string; title: string; summary?: string }> },
  };
  const content = contentMap[slug];
  const result = content?.results.find((r: { id: string }) => r.id === rid);
  const card = CARD[rid];

  const title = result?.title ?? 'TestLoop';
  const summary = result?.summary ?? '';
  const bg = card?.bg ?? '#6366F1';
  const ink = card?.ink ?? '#FFFFFF';
  const accent = card?.accent ?? '#A5B4FC';
  const name = card?.name ?? title;
  const tagline = card?.tagline ?? '';
  const no = card?.no ?? '??';

  return new ImageResponse(
    (
      <div
        style={{
          width: '600px',
          height: '600px',
          background: bg,
          display: 'flex',
          flexDirection: 'column',
          padding: '32px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 프레임 */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          right: '10px', bottom: '10px',
          border: `5px solid ${ink}`, borderRadius: '12px', opacity: 0.3,
        }} />

        {/* 상단 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{
            background: ink, color: bg, borderRadius: '20px',
            padding: '6px 16px', fontSize: '16px', fontWeight: 700,
          }}>
            참교육 진단서 No.{no}
          </div>
          <div style={{ color: ink, fontSize: '14px', opacity: 0.6 }}>TestLoop</div>
        </div>

        {/* 메인 유형명 */}
        <div style={{
          fontSize: name.length > 6 ? '52px' : '64px',
          fontWeight: 900, color: ink, lineHeight: 1.1,
          marginBottom: '12px',
        }}>
          {name}
        </div>

        {/* 태그라인 */}
        <div style={{
          fontSize: '24px', fontWeight: 700,
          color: accent, marginBottom: '32px',
        }}>
          — {tagline}
        </div>

        {/* 펀치라인 */}
        {summary && (
          <div style={{
            background: `${ink}15`,
            border: `3px solid ${ink}30`,
            borderRadius: '10px',
            padding: '16px 20px',
            fontSize: '20px', fontWeight: 600,
            color: ink, lineHeight: 1.5,
          }}>
            &ldquo;{summary}&rdquo;
          </div>
        )}

        {/* 푸터 */}
        <div style={{
          position: 'absolute', left: '10px', right: '10px', bottom: '10px',
          height: '48px', background: `${ink}20`,
          borderRadius: '0 0 8px 8px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', fontWeight: 700, color: ink,
        }}>
          나의 참교육 유형은? 👉 testloop-alpha.vercel.app
        </div>
      </div>
    ),
    { width: 600, height: 600 }
  );
}
