'use client';

import { useState } from 'react';
import type { Question, RawAnswer } from '@/lib/scoring/contract';

interface TestPlayerProps {
  questions: Question[];
  onComplete: (answers: RawAnswer[]) => void;
}

export function TestPlayer({ questions, onComplete }: TestPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<RawAnswer[]>([]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const selectedOptionId = answers.find(
    (a) => a.questionId === currentQuestion.id
  )?.optionId;

  const handleSelect = (optionId: string) => {
    const newAnswers = answers.filter(
      (a) => a.questionId !== currentQuestion.id
    );
    newAnswers.push({ questionId: currentQuestion.id, optionId });
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!selectedOptionId) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 진행 바 */}
      <div className="w-full h-1.5 bg-gray-200">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 문항 번호 */}
      <div className="px-6 pt-6 pb-2">
        <span className="text-sm text-gray-400 font-medium">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* 문항 */}
      <div className="flex-1 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.text}
        </h2>

        {/* 선택지 */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all font-medium ${
                selectedOptionId === option.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/30'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="px-6 pb-8 flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
          >
            이전
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!selectedOptionId}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
            selectedOptionId
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentIndex < questions.length - 1 ? '다음' : '결과 보기'}
        </button>
      </div>
    </div>
  );
}
