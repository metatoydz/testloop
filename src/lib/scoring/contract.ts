// ResolvedResult - 모든 엔진이 반환하는 정규화 결과
export interface ResolvedResult {
  resultId: string;
  view: {
    title: string;
    description: string;
    image: string;
    shareText: string;
  };
  products: string[];
  display?: {
    score?: number;
    typeKey?: string;
    matchPercent?: number;
    badges?: { label: string; value: string }[];
  };
  engineMeta: { engine: string; engineVersion: string };
}

// 답안 타입
export type CleanAnswers = { questionId: string; optionId: string }[];
export type RawAnswer = { questionId: string; optionId: string };

// 옵션 타입
export interface Option {
  id: string;
  label: string;
  image?: string;
  score?: number; // sum 엔진용
  axis?: Record<string, number>; // type/match 엔진용
}

// 문항 타입
export interface Question {
  id: string;
  text: string;
  image?: string;
  options: Option[];
}

// 결과 매핑 타입
export type ResultMapping =
  | { kind: 'range'; min: number; max: number }
  | { kind: 'typeKey'; key: string }
  | { kind: 'answer'; pattern: Record<string, string | string[]>; priority: number };

// 결과 타입
export interface TestResult {
  id: string;
  title: string;
  summary?: string;
  description: string;
  image: string;
  shareText: string;
  products: string[];
  mapping: ResultMapping;
}

// 엔진 설정 타입
export interface EngineConfig {
  axes?: { pair: [string, string]; tieBreak: string }[];
}

// 콘텐츠 타입
export interface TestContent {
  slug: string;
  engine: 'sum' | 'type' | 'match' | 'answer' | 'rules';
  engineVersion: string;
  contentType: string;
  version: number;
  fallbackResultId: string;
  allowPartial: boolean;
  meta: {
    title: string;
    description: string;
    thumbnail: string;
    category: string;
    tags: string[];
    estimatedSec: number;
    publishedAt: string;
  };
  questions: Question[];
  results: TestResult[];
  engineConfig?: EngineConfig;
}

// 상품 타입
export interface Product {
  name: string;
  image: string;
  coupangUrl: string;
  category: string;
}

// 엔진 인터페이스
export interface ScoringEngine {
  id: string;
  version: string;
  capabilities: { requiresPartner: boolean };
  validateContent(content: TestContent): { ok: boolean; errors: string[] };
  compute(content: TestContent, answers: CleanAnswers): ResolvedResult;
}
