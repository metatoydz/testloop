import type {
  ScoringEngine,
  TestContent,
  CleanAnswers,
  ResolvedResult,
} from '../contract';
import { toResolved } from '../toResolved';

function findOption(content: TestContent, questionId: string, optionId: string) {
  const question = content.questions.find((q) => q.id === questionId);
  if (!question) return null;
  return question.options.find((o) => o.id === optionId) ?? null;
}

export const tallyEngine: ScoringEngine = {
  id: 'tally',
  version: '1',
  capabilities: { requiresPartner: false },

  validateContent(content: TestContent): { ok: boolean; errors: string[] } {
    const errors: string[] = [];

    const buckets = content.engineConfig?.buckets;
    const tieBreak = content.engineConfig?.tieBreak;

    // 1) buckets 비어있지 않음
    if (!buckets || buckets.length === 0) {
      errors.push('engineConfig.buckets is required and must not be empty');
      return { ok: false, errors };
    }

    // 2) tieBreak가 buckets의 완전 순열
    if (!tieBreak || tieBreak.length === 0) {
      errors.push('engineConfig.tieBreak is required and must not be empty');
    } else {
      const bucketSet = new Set(buckets);
      const tieBreakSet = new Set(tieBreak);

      if (tieBreak.length !== buckets.length) {
        errors.push(
          `engineConfig.tieBreak must be a complete permutation of buckets (expected ${buckets.length} items, got ${tieBreak.length})`
        );
      } else {
        for (const b of buckets) {
          if (!tieBreakSet.has(b)) {
            errors.push(`engineConfig.tieBreak is missing bucket: "${b}"`);
          }
        }
        for (const t of tieBreak) {
          if (!bucketSet.has(t)) {
            errors.push(`engineConfig.tieBreak has unknown bucket: "${t}"`);
          }
        }
      }
    }

    // 3) 모든 옵션의 tally 키 ∈ buckets, 값은 정수 ≥ 0
    const bucketSet = new Set(buckets);
    for (const q of content.questions) {
      for (const opt of q.options) {
        if (!opt.tally) continue;
        for (const [bucket, pts] of Object.entries(opt.tally)) {
          if (!bucketSet.has(bucket)) {
            errors.push(
              `Option "${opt.id}" in question "${q.id}" has unknown tally bucket: "${bucket}"`
            );
          }
          if (!Number.isInteger(pts) || pts < 0) {
            errors.push(
              `Option "${opt.id}" in question "${q.id}" has invalid tally value for bucket "${bucket}": ${pts} (must be integer >= 0)`
            );
          }
        }
      }
    }

    // 4) 모든 결과의 mapping.kind === "tally", mapping.bucket ∈ buckets
    // 5) bucket ↔ result 1:1
    const bucketToResults = new Map<string, string[]>();
    for (const b of buckets) bucketToResults.set(b, []);

    for (const result of content.results) {
      if (!result.mapping || result.mapping.kind !== 'tally') {
        errors.push(
          `Result "${result.id}" must have mapping.kind === "tally"`
        );
        continue;
      }
      const bucket = result.mapping.bucket;
      if (!bucketSet.has(bucket)) {
        errors.push(
          `Result "${result.id}" has unknown bucket: "${bucket}"`
        );
      } else {
        bucketToResults.get(bucket)!.push(result.id);
      }
    }

    for (const [bucket, resultIds] of bucketToResults.entries()) {
      if (resultIds.length === 0) {
        errors.push(`Bucket "${bucket}" has no corresponding result`);
      } else if (resultIds.length > 1) {
        errors.push(
          `Bucket "${bucket}" is mapped to multiple results: ${resultIds.join(', ')}`
        );
      }
    }

    // 6) fallbackResultId가 실재 결과를 가리킴
    const resultIds = new Set(content.results.map((r) => r.id));
    if (!resultIds.has(content.fallbackResultId)) {
      errors.push(
        `fallbackResultId "${content.fallbackResultId}" does not exist in results`
      );
    }

    return { ok: errors.length === 0, errors };
  },

  compute(content: TestContent, answers: CleanAnswers): ResolvedResult {
    try {
      const buckets = content.engineConfig?.buckets ?? [];
      const tieBreak = content.engineConfig?.tieBreak ?? buckets;

      // bucket별 점수 초기화
      const score: Record<string, number> = Object.fromEntries(
        buckets.map((b) => [b, 0])
      );

      // 선택지의 tally 합산
      for (const a of answers) {
        const opt = findOption(content, a.questionId, a.optionId);
        if (!opt) continue;
        for (const [bucket, pts] of Object.entries(opt.tally ?? {})) {
          if (bucket in score) {
            score[bucket] += pts;
          }
        }
      }

      // 최고점 결정 (동점은 tieBreak 순서가 빠른 쪽)
      const max = Math.max(...Object.values(score), 0);
      const top = tieBreak.find((b) => score[b] === max) ?? buckets[0];

      // bucket → result 매핑
      const result = content.results.find(
        (r) => r.mapping?.kind === 'tally' && (r.mapping as { kind: 'tally'; bucket: string }).bucket === top
      );

      const resultId = result?.id ?? content.fallbackResultId;
      const resolved = toResolved(content, resultId);

      return {
        ...resolved,
        display: {
          score: max,
          typeKey: top,
        },
        engineMeta: {
          engine: tallyEngine.id,
          engineVersion: tallyEngine.version,
        },
      };
    } catch {
      // 절대 throw 안 함 → fallback 반환
      return toResolved(content, content.fallbackResultId);
    }
  },
};
