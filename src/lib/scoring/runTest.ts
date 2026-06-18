import type { RawAnswer, ResolvedResult } from './contract';
import type { TestContent } from './contract';
import { getEngine } from './registry';
import { normalizeAnswers } from './normalize';
import { toResolved } from './toResolved';

export function runTest(
  content: TestContent,
  rawAnswers: RawAnswer[]
): ResolvedResult {
  try {
    // 1. 엔진 조회
    const engine = getEngine(content.engine);
    if (!engine) {
      console.error(`[runTest] Engine not found: ${content.engine}`);
      return toResolved(content, content.fallbackResultId);
    }

    // 2. 답안 정제
    const cleanAnswers = normalizeAnswers(rawAnswers, content);
    if (cleanAnswers === null) {
      console.warn('[runTest] normalizeAnswers returned null, using fallback');
      return toResolved(content, content.fallbackResultId);
    }

    // 3. 점수 계산
    const result = engine.compute(content, cleanAnswers);
    return result;
  } catch (err) {
    // 절대 throw 안 함 - fallback 반환
    console.error('[runTest] Unexpected error, using fallback:', err);
    try {
      return toResolved(content, content.fallbackResultId);
    } catch {
      return {
        resultId: content.fallbackResultId,
        view: {
          title: '결과를 불러올 수 없습니다',
          description: '잠시 후 다시 시도해주세요.',
          image: '',
          shareText: '테스트를 완료했습니다!',
        },
        products: [],
        engineMeta: { engine: content.engine, engineVersion: content.engineVersion },
      };
    }
  }
}
