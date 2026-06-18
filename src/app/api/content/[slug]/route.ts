import { NextResponse } from 'next/server';
import { loadContent } from '@/lib/content/loader';

interface Context {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: Context) {
  const { slug } = await params;
  const content = loadContent(slug);

  if (!content) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(content);
}
