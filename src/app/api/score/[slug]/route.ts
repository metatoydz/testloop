import { NextResponse } from 'next/server';
import { loadContent } from '@/lib/content/loader';
import { runTest } from '@/lib/scoring/runTest';
import type { RawAnswer } from '@/lib/scoring/contract';

interface Context {
  params: Promise<{ slug: string }>;
}

export async function POST(req: Request, { params }: Context) {
  const { slug } = await params;
  const content = loadContent(slug);

  if (!content) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 });
  }

  let body: { answers: RawAnswer[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { answers } = body;
  if (!Array.isArray(answers)) {
    return NextResponse.json({ error: 'answers must be an array' }, { status: 400 });
  }

  const result = runTest(content, answers);
  return NextResponse.json(result);
}
