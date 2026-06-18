import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadContent } from '@/lib/content/loader';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = loadContent(slug);
  if (!content) return { title: '테스트를 찾을 수 없습니다' };

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  return {
    title: content.meta.title,
    description: content.meta.description,
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      images: [{ url: `${base}${content.meta.thumbnail}` }],
    },
  };
}

export default async function TestStartPage({ params }: Props) {
  const { slug } = await params;
  const content = loadContent(slug);

  if (!content) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md mx-auto text-center">
        {/* 썸네일 */}
        <div className="text-6xl mb-6">🎯</div>

        {/* 메타 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {content.meta.title}
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {content.meta.description}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {content.meta.tags.map((tag) => (
            <span
              key={tag}
              className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 정보 */}
        <div className="flex justify-center gap-6 text-sm text-gray-400 mb-10">
          <span>⏱ 약 {content.meta.estimatedSec}초</span>
          <span>📝 {content.questions.length}문항</span>
        </div>

        {/* 시작 버튼 */}
        <Link
          href={`/test/${slug}/play`}
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-md"
        >
          테스트 시작하기 →
        </Link>

        <Link
          href="/"
          className="block mt-4 text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          ← 다른 테스트 보기
        </Link>
      </div>
    </main>
  );
}
