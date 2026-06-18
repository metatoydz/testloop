export const runtime = 'nodejs';

import { ImageResponse } from 'next/og';
import { loadContent } from '@/lib/content/loader';
import { toResolved } from '@/lib/scoring/toResolved';

// 참교육 유형별 OG 카드 색/문구 매핑 (§6.2, §6.3)
const CHAMGYOYUK_CARD: Record<
  string,
  {
    bg: string;
    ink: string;
    tagline: string;
    stamp: string;
    frame: string;
    pillBg: string;
    pillText: string;
    footerBg: string;
    footerText: string;
    name: string;
    taglineText: string;
    no: string;
  }
> = {
  late: {
    bg: '#FFD23F',
    ink: '#181818',
    tagline: '#5A4500',
    stamp: '#C8102E',
    frame: '#181818',
    pillBg: '#181818',
    pillText: '#FFD23F',
    footerBg: '#181818',
    footerText: '#FFD23F',
    name: '곧도착러',
    taglineText: '지각계의 큰손',
    no: 'No.01',
  },
  myway: {
    bg: '#E8332E',
    ink: '#FFFFFF',
    tagline: '#FFD9D7',
    stamp: '#FFFFFF',
    frame: '#FFFFFF',
    pillBg: '#FFFFFF',
    pillText: '#E8332E',
    footerBg: '#7A1411',
    footerText: '#FFFFFF',
    name: '답정너',
    taglineText: '근데 내 말이 맞잖아',
    no: 'No.02',
  },
  mbti: {
    bg: '#B7A6FF',
    ink: '#26215C',
    tagline: '#3C3489',
    stamp: '#C8102E',
    frame: '#26215C',
    pillBg: '#26215C',
    pillText: '#B7A6FF',
    footerBg: '#26215C',
    footerText: '#B7A6FF',
    name: 'MBTI과몰입',
    taglineText: '그건 네가 F라서 그래',
    no: 'No.03',
  },
  plan: {
    bg: '#8FD05A',
    ink: '#173404',
    tagline: '#27500A',
    stamp: '#C8102E',
    frame: '#173404',
    pillBg: '#173404',
    pillText: '#8FD05A',
    footerBg: '#173404',
    footerText: '#8FD05A',
    name: '내일부터',
    taglineText: '계획만 인간',
    no: 'No.04',
  },
  night: {
    bg: '#2E3A8C',
    ink: '#FFFFFF',
    tagline: '#C7CEF5',
    stamp: '#FFFFFF',
    frame: '#FFFFFF',
    pillBg: '#FFFFFF',
    pillText: '#2E3A8C',
    footerBg: '#1B2566',
    footerText: '#FFFFFF',
    name: '자니?',
    taglineText: '새벽 감성 발신인',
    no: 'No.05',
  },
  talk: {
    bg: '#FF9EC0',
    ink: '#4B1528',
    tagline: '#993556',
    stamp: '#C8102E',
    frame: '#4B1528',
    pillBg: '#4B1528',
    pillText: '#FF9EC0',
    footerBg: '#4B1528',
    footerText: '#FF9EC0',
    name: '대화강탈',
    taglineText: '아 그거 나도~',
    no: 'No.06',
  },
  taste: {
    bg: '#FF9F45',
    ink: '#4A1B0C',
    tagline: '#712B13',
    stamp: '#C8102E',
    frame: '#4A1B0C',
    pillBg: '#4A1B0C',
    pillText: '#FF9F45',
    footerBg: '#4A1B0C',
    footerText: '#FF9F45',
    name: '부먹찍먹',
    taglineText: '취향 강요반',
    no: 'No.07',
  },
  ghost: {
    bg: '#C4C2BA',
    ink: '#2C2C2A',
    tagline: '#444441',
    stamp: '#C8102E',
    frame: '#2C2C2A',
    pillBg: '#2C2C2A',
    pillText: '#C4C2BA',
    footerBg: '#2C2C2A',
    footerText: '#C4C2BA',
    name: '읽씹장인',
    taglineText: '어 봤는데 까먹음',
    no: 'No.08',
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';
  const rid = searchParams.get('rid') ?? '';

  const content = loadContent(slug);
  const resolved = content ? toResolved(content, rid) : null;

  const title = resolved?.view.title ?? 'TestLoop';
  const testTitle = content?.meta.title ?? 'TestLoop';

  // 구글 NotoSansKR 폰트 로드 (weight 700, 800, 900)
  // NotoSansKR 폰트 로드 - next/og는 TTF만 지원
  // jsDelivr CDN에서 직접 TTF 파일 로드
  let fontData: ArrayBuffer | null = null;
  try {
    const fontRes = await fetch(
      'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.1.0/files/noto-sans-kr-korean-700-normal.woff'
    );
    if (fontRes.ok) fontData = await fontRes.arrayBuffer();
  } catch {
    // 폰트 로드 실패 시 기본 폰트
  }

  const fonts: { name: string; data: ArrayBuffer; style: 'normal'; weight: 700 | 900 }[] = [];
  if (fontData) {
    fonts.push({ name: 'NotoSansKR', data: fontData, style: 'normal', weight: 700 });
    fonts.push({ name: 'NotoSansKR', data: fontData, style: 'normal', weight: 900 });
  }
  const fontFamily = fonts.length > 0 ? 'NotoSansKR' : 'sans-serif';

  // 참교육 테스트 전용 카드
  const cardCfg = slug === 'chamgyoyuk' ? CHAMGYOYUK_CARD[rid] : undefined;

  if (cardCfg) {
    // 결과의 summary(펀치라인) 가져오기
    const result = content?.results.find((r) => r.id === rid);
    const summary = result?.summary ?? '';

    // NAME 폰트 크기 (긴 이름은 축소)
    const nameFontSize = cardCfg.name.length > 5 ? 96 : 150;

    return new ImageResponse(
      (
        <div
          style={{
            width: '800px',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            background: cardCfg.bg,
            fontFamily,
          }}
        >
          {/* 프레임 */}
          <div
            style={{
              position: 'absolute',
              top: '11px',
              left: '11px',
              right: '11px',
              bottom: '11px',
              border: `10px solid ${cardCfg.frame}`,
              borderRadius: '7px',
            }}
          />

          {/* 라벨 필 */}
          <div
            style={{
              position: 'absolute',
              top: '33px',
              left: '36px',
              width: '221px',
              height: '33px',
              background: cardCfg.pillBg,
              borderRadius: '17px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '17px',
              fontWeight: 800,
              color: cardCfg.pillText,
            }}
          >
            참교육 진단서 {cardCfg.no}
          </div>

          {/* 도장 (이중원 + 텍스트) */}
          <div
            style={{
              position: 'absolute',
              top: '39px',
              left: '614px',
              width: '125px',
              height: '125px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-14deg)',
            }}
          >
            {/* 외원 */}
            <div
              style={{
                position: 'absolute',
                width: '125px',
                height: '125px',
                borderRadius: '50%',
                border: `8px solid ${cardCfg.stamp}`,
              }}
            />
            {/* 내원 */}
            <div
              style={{
                position: 'absolute',
                width: '103px',
                height: '103px',
                borderRadius: '50%',
                border: `6px solid ${cardCfg.stamp}`,
              }}
            />
            {/* 도장 텍스트 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: cardCfg.stamp,
                fontSize: '28px',
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              <span>참교육</span>
              <span>필요</span>
            </div>
          </div>

          {/* 유형명 */}
          <div
            style={{
              position: 'absolute',
              left: '72px',
              bottom: '268px',
              fontSize: `${nameFontSize}px`,
              fontWeight: 900,
              color: cardCfg.ink,
              lineHeight: 1,
            }}
          >
            {cardCfg.name}
          </div>

          {/* 태그라인 */}
          <div
            style={{
              position: 'absolute',
              left: '78px',
              bottom: '210px',
              fontSize: '44px',
              fontWeight: 800,
              color: cardCfg.tagline,
            }}
          >
            {cardCfg.taglineText}
          </div>

          {/* 펀치라인 박스 */}
          <div
            style={{
              position: 'absolute',
              left: '72px',
              bottom: '100px',
              width: '900px',
              minHeight: '96px',
              background: '#FFFFFF',
              border: `6px solid ${cardCfg.frame}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 20px',
              fontSize: '34px',
              fontWeight: 700,
              color: '#181818',
              flexWrap: 'wrap',
            }}
          >
            {summary}
          </div>

          {/* 푸터 바 */}
          <div
            style={{
              position: 'absolute',
              left: '11px',
              bottom: '11px',
              width: '1164px',
              height: '54px',
              background: cardCfg.footerBg,
              borderRadius: '0 0 4px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
              color: cardCfg.footerText,
            }}
          >
            나의 참교육 유형은?
          </div>
        </div>
      ),
      {
        width: 800,
        height: 400,
        fonts,
      }
    );
  }

  // 기본 카드 (참교육 외 테스트용)
  const description = resolved?.view.description ?? '나를 알아가는 재미있는 테스트';

  // 위에서 로드한 fontData 재사용
  const fontDataGeneric = fontData;

  return new ImageResponse(
    (
      <div
        style={{
          width: '800px',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
          fontFamily: fontFamily,
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
      width: 800,
      height: 400,
      fonts: fontDataGeneric
        ? [
            {
              name: 'NotoSansKR',
              data: fontDataGeneric,
              style: 'normal' as const,
              weight: 400 as const,
            },
          ]
        : [],
    }
  );
}


