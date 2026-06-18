import type { TestContent, ResolvedResult } from './contract';

function toAbsoluteUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function toResolved(content: TestContent, resultId: string): ResolvedResult {
  const result = content.results.find((r) => r.id === resultId);

  if (!result) {
    // fallback 결과도 없으면 빈 결과 반환
    return {
      resultId,
      view: {
        title: '결과를 찾을 수 없습니다',
        description: '결과를 처리하는 중 문제가 발생했습니다.',
        image: toAbsoluteUrl('/images/fallback.png'),
        shareText: '테스트를 완료했습니다!',
      },
      products: [],
      engineMeta: { engine: 'unknown', engineVersion: '0.0.0' },
    };
  }

  return {
    resultId: result.id,
    view: {
      title: result.title,
      description: result.description,
      image: toAbsoluteUrl(result.image),
      shareText: result.shareText,
    },
    products: result.products,
    engineMeta: { engine: content.engine, engineVersion: content.engineVersion },
  };
}
