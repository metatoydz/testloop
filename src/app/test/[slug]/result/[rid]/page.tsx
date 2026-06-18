import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadContent } from '@/lib/content/loader';
import { toResolved } from '@/lib/scoring/toResolved';
import { ResultCard } from '@/components/ResultCard';
import { ShareButtons } from '@/components/ShareButtons';
import { ProductList } from '@/components/ProductList';
import type { Metadata } from 'next';
import type { Product } from '@/lib/scoring/contract';
import productsData from '../../../../../../content/products.json';

interface Props {
  params: Promise<{ slug: string; rid: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, rid } = await params;
  const content = loadContent(slug);
  if (!content) return { title: '결과를 찾을 수 없습니다' };

  const resolved = toResolved(content, rid);
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://testloop-alpha.vercel.app';
  const ogUrl = `${base}/api/og?slug=${slug}&rid=${rid}`;

  return {
    title: `${resolved.view.title} - ${content.meta.title}`,
    description: resolved.view.description,
    openGraph: {
      title: resolved.view.title,
      description: resolved.view.description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolved.view.title,
      description: resolved.view.description,
      images: [ogUrl],
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { slug, rid } = await params;
  const content = loadContent(slug);

  if (!content) {
    notFound();
  }

  const resolved = toResolved(content, rid);
  // 상품 로드 (products.json은 pid → Product 딕셔너리)
  const productsMap = productsData as Record<string, Product>;
  const resultProducts: Product[] = resolved.products
    .map((pid) => productsMap[pid])
    .filter((p): p is Product => Boolean(p));

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-16">
      <div className="max-w-md mx-auto px-0 pt-8">
        {/* 결과 카드 */}
        <div className="px-4 mb-6">
          <ResultCard
            result={resolved}
            summary={content.results.find(r => r.id === rid)?.summary}
          />
        </div>

        {/* 공유 버튼 */}
        <div className="mb-8">
          <ShareButtons
            result={resolved}
            url={`https://testloop-alpha.vercel.app/test/${slug}/result/${rid}`}
          />
        </div>

        {/* 추천 상품 */}
        {resultProducts.length > 0 && (
          <div className="mb-8">
            <ProductList products={resultProducts} />
          </div>
        )}

        {/* 다시 하기 / 홈 */}
        <div className="px-4 flex flex-col gap-3">
          <Link
            href={`/test/${slug}/play`}
            className="block w-full text-center border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 rounded-xl transition-colors"
          >
            다시 해보기
          </Link>
          <Link
            href="/"
            className="block w-full text-center text-gray-400 hover:text-gray-600 text-sm transition-colors py-2"
          >
            ← 다른 테스트 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
