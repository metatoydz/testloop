import type { CleanAnswers, RawAnswer, TestContent } from './contract';

export function normalizeAnswers(
  rawAnswers: RawAnswer[],
  content: TestContent
): CleanAnswers | null {
  const validQuestionIds = new Set(content.questions.map((q) => q.id));

  // 미존재 questionId 거부
  for (const answer of rawAnswers) {
    if (!validQuestionIds.has(answer.questionId)) {
      console.warn(`[normalize] Unknown questionId: ${answer.questionId}`);
      return null;
    }

    const question = content.questions.find((q) => q.id === answer.questionId);
    const validOptionIds = new Set(question!.options.map((o) => o.id));
    if (!validOptionIds.has(answer.optionId)) {
      console.warn(
        `[normalize] Unknown optionId: ${answer.optionId} for question ${answer.questionId}`
      );
      return null;
    }
  }

  // questionId별 중복 제거 (마지막 응답 우선)
  const answerMap = new Map<string, string>();
  for (const answer of rawAnswers) {
    answerMap.set(answer.questionId, answer.optionId);
  }

  // 완전 응답 검사
  if (!content.allowPartial) {
    for (const question of content.questions) {
      if (!answerMap.has(question.id)) {
        console.warn(`[normalize] Missing answer for question: ${question.id}`);
        return null;
      }
    }
  }

  const clean: CleanAnswers = [];
  for (const [questionId, optionId] of answerMap) {
    clean.push({ questionId, optionId });
  }

  return clean;
}
