export const runtime = 'nodejs';

import { ImageResponse } from 'next/og';
import { loadContent } from '@/lib/content/loader';
import { toResolved } from '@/lib/scoring/toResolved';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';
  const rid = searchParams.get('rid') ?? '';

  const content = loadContent(slug);
  const resolved = content ? toResolved(content, rid) : null;

  const title = resolved?.view.title ?? 'TestLoop';
  const description = resolved?.view.description ?? '나를 알아가는 재미있는 테스트';
  const testTitle = content?.meta.title ?? 'TestLoop';

  // 구글 NotoSansKR 폰트 로드
  let fontData: ArrayBuffer | null = null;
  try {
    const fontRes = await fetch(
      'https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgm20xz64px_1hVWr0wuPNGmlQNMEfD4.0.woff2'
    );
    fontData = await fontRes.arrayBuffer();
  } catch {
    // 폰트 로드 실패 시 기본 폰트 사용
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
          fontFamily: fontData ? 'NotoSansKR' : 'sans-serif',
          padding: '60px',
        }}
      >
        {/* 브랜드 */}
        <div
          style={{
            fontSize: '24px',
            color: '#6366f1',
            fontWeight: 700,
            marginBottom: '32px',
            letterSpacing: '0.05em',
          }}
        >
          🎯 TestLoop
        </div>

        {/* 테스트 이름 */}
        <div
          style={{
            fontSize: '28px',
            color: '#6b7280',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          {testTitle}
        </div>

        {/* 결과 제목 */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 900,
            color: '#1f2937',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {/* 결과 설명 */}
        <div
          style={{
            fontSize: '24px',
            color: '#4b5563',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '800px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [
            {
              name: 'NotoSansKR',
              data: fontData,
              style: 'normal',
            },
          ]
        : [],
    }
  );
}
