
import React from 'react';

interface ScoreCardProps {
  score: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const offset = circumference - (score / 100) * circumference;

  const getStrokeColor = (s: number) => {
    if (s >= 75) return 'stroke-green-500';
    if (s >= 40) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center col-span-1 md:col-span-2">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Relevance Score</h3>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-slate-200 dark:text-slate-700"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${getStrokeColor(score)}`}
            strokeWidth="10"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">{score}</span>
          <span className="text-xl font-semibold text-slate-500 dark:text-slate-400">%</span>
        </div>
      </div>
    </div>
  );
};
