import type {
  ScoringEngine,
  TestContent,
  CleanAnswers,
  ResolvedResult,
} from '../contract';
import { toResolved } from '../toResolved';

export const sumEngine: ScoringEngine = {
  id: 'sum',
  version: '1.0.0',
  capabilities: { requiresPartner: false },

  validateContent(content: TestContent): { ok: boolean; errors: string[] } {
    const errors: string[] = [];

    if (content.engine !== 'sum') {
      errors.push(`Engine mismatch: expected 'sum', got '${content.engine}'`);
    }

    // sum 엔진은 range 매핑만 사용
    const rangeResults = content.results.filter(
      (r) => r.mapping.kind === 'range'
    );

    if (rangeResults.length === 0) {
      errors.push('sum engine requires at least one result with kind=range mapping');
      return { ok: false, errors };
    }

    // 가능한 총점 범위 계산
    let minPossible = 0;
    let maxPossible = 0;

    for (const q of content.questions) {
      const scores = q.options
        .map((o) => o.score ?? 0)
        .filter((s) => typeof s === 'number');
      if (scores.length > 0) {
        minPossible += Math.min(...scores);
        maxPossible += Math.max(...scores);
      }
    }

    // range 매핑을 min 기준으로 정렬
    const ranges = rangeResults
      .filter((r) => r.mapping.kind === 'range')
      .map((r) => r.mapping as { kind: 'range'; min: number; max: number })
      .sort((a, b) => a.min - b.min);

    // 빈틈 없이 커버하는지 검증
    let cursor = minPossible;
    for (const range of ranges) {
      if (range.min > cursor) {
        errors.push(
          `Gap in range coverage: [${cursor}, ${range.min}) is not covered`
        );
      }
      cursor = range.max;
    }

    if (cursor < maxPossible) {
      errors.push(
        `Range coverage ends at ${cursor} but max possible score is ${maxPossible}`
      );
    }

    return { ok: errors.length === 0, errors };
  },

  compute(content: TestContent, answers: CleanAnswers): ResolvedResult {
    // 총점 계산
    let totalScore = 0;

    for (const answer of answers) {
      const question = content.questions.find((q) => q.id === answer.questionId);
      if (!question) continue;
      const option = question.options.find((o) => o.id === answer.optionId);
      if (!option) continue;
      totalScore += option.score ?? 0;
    }

    // 점수에 맞는 결과 찾기
    // [min, max) 반열린 구간, 마지막 구간만 max 포함
    const rangeResults = content.results
      .filter((r) => r.mapping.kind === 'range')
      .sort((a, b) => {
        const am = a.mapping as { kind: 'range'; min: number; max: number };
        const bm = b.mapping as { kind: 'range'; min: number; max: number };
        return am.min - bm.min;
      });

    let matchedResultId: string | null = null;

    for (let i = 0; i < rangeResults.length; i++) {
      const result = rangeResults[i];
      const mapping = result.mapping as { kind: 'range'; min: number; max: number };
      const isLast = i === rangeResults.length - 1;

      if (isLast) {
        // 마지막 구간: max 포함
        if (totalScore >= mapping.min && totalScore <= mapping.max) {
          matchedResultId = result.id;
          break;
        }
      } else {
        // 일반 구간: [min, max) 반열린
        if (totalScore >= mapping.min && totalScore < mapping.max) {
          matchedResultId = result.id;
          break;
        }
      }
    }

    const resultId = matchedResultId ?? content.fallbackResultId;
    const resolved = toResolved(content, resultId);

    return {
      ...resolved,
      display: {
        score: totalScore,
      },
      engineMeta: {
        engine: sumEngine.id,
        engineVersion: sumEngine.version,
      },
    };
  },
};
