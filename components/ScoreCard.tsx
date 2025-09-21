import React from 'react';
import type { AnalysisResult } from '../types';

interface AnalysisGaugeProps {
  score: number;
  verdict: AnalysisResult['verdict'];
}

const CheckBadgeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

const verdictConfig = {
  'High Suitability': {
    icon: <CheckBadgeIcon className="w-8 h-8 text-green-500" />,
    color: 'text-green-500',
    stroke: 'stroke-green-500',
  },
  'Medium Suitability': {
    icon: <ExclamationTriangleIcon className="w-8 h-8 text-amber-500" />,
    color: 'text-amber-500',
    stroke: 'stroke-amber-500',
  },
  'Low Suitability': {
    icon: <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />,
    color: 'text-red-500',
    stroke: 'stroke-red-500',
  }
};

export const AnalysisGauge: React.FC<AnalysisGaugeProps> = ({ score, verdict }) => {
  const radius = 85;
  const circumference = Math.PI * radius; // Half circle
  const offset = circumference - (score / 100) * circumference;
  const config = verdictConfig[verdict] || verdictConfig['Medium Suitability'];

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Analysis Summary</h3>
        <div className="relative w-64 h-32">
            <svg className="w-full h-full" viewBox="0 0 200 100">
                <path
                    d="M 15 100 A 85 85 0 0 1 185 100"
                    className="stroke-slate-200 dark:stroke-slate-700"
                    strokeWidth="20"
                    strokeLinecap="round"
                    fill="none"
                />
                <path
                    d="M 15 100 A 85 85 0 0 1 185 100"
                    className={`transition-all duration-1000 ease-out ${config.stroke}`}
                    strokeWidth="20"
                    strokeLinecap="round"
                    fill="none"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                    }}
                />
            </svg>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="text-5xl font-bold text-slate-800 dark:text-slate-100">{score}
                    <span className="text-3xl font-semibold text-slate-500 dark:text-slate-400">%</span>
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Relevance Score</span>
            </div>
        </div>
        <div className={`mt-4 flex items-center gap-2 p-2 px-4 rounded-full bg-slate-100 dark:bg-slate-700/50`}>
            {config.icon}
            <span className={`text-lg font-semibold ${config.color}`}>{verdict}</span>
        </div>
    </div>
  );
};