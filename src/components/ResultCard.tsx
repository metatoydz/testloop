import type { ResolvedResult } from '@/lib/scoring/contract';
import Image from 'next/image';

interface ResultCardProps {
  result: ResolvedResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const { view, display } = result;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {view.image && (
        <div className="relative w-full aspect-square">
          <Image
            src={view.image}
            alt={view.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="p-6">
        {display?.score !== undefined && (
          <div className="mb-3 inline-block bg-indigo-50 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full">
            총점: {display.score}점
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{view.title}</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {view.description}
        </p>
        {display?.badges && display.badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {display.badges.map((badge, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {badge.label}: {badge.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
