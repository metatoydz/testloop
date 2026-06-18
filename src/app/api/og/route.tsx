import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';
  const rid = searchParams.get('rid') ?? '';

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://testloop-alpha.vercel.app';

  // 정적 OG 이미지 경로
  const imagePath = slug && rid
    ? `${base}/og/${slug}-${rid}.png`
    : `${base}/og/default.png`;

  // 이미지 파일이 있으면 리다이렉트
  return NextResponse.redirect(imagePath, { status: 302 });
}
