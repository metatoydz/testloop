import Link from 'next/link';
import { loadAllContent } from '@/lib/content/loader';

export default function HomePage() {
  const tests = loadAllContent();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-10">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 TestLoop
          </h1>
          <p className="text-gray-500">나를 알아가는 재미있는 테스트들</p>
        </div>

        {/* 테스트 카드 목록 */}
        <div className="flex flex-col gap-4">
          {tests.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p className="text-4xl mb-3">📭</p>
              <p>아직 등록된 테스트가 없어요</p>
            </div>
          ) : (
            tests.map((test) => (
              <Link
                key={test.slug}
                href={`/test/${test.slug}`}
                className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🧪</div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                      {test.meta.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {test.meta.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>⏱ 약 {test.meta.estimatedSec}초</span>
                      <span>📝 {test.questions.length}문항</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
