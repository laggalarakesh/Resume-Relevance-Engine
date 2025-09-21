
import React from 'react';
import type { AnalysisResult } from '../types';

interface VerdictCardProps {
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
    icon: <CheckBadgeIcon className="w-12 h-12 text-green-600 dark:text-green-400" />,
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    textColor: 'text-green-800 dark:text-green-200'
  },
  'Medium Suitability': {
    icon: <ExclamationTriangleIcon className="w-12 h-12 text-amber-600 dark:text-amber-400" />,
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
    textColor: 'text-amber-800 dark:text-amber-200'
  },
  'Low Suitability': {
    icon: <ExclamationTriangleIcon className="w-12 h-12 text-red-600 dark:text-red-400" />,
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    textColor: 'text-red-800 dark:text-red-200'
  }
};


export const VerdictCard: React.FC<VerdictCardProps> = ({ verdict }) => {
    const config = verdictConfig[verdict] || verdictConfig['Medium Suitability'];
    return (
        <div className={`p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center ${config.bgColor}`}>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Verdict</h3>
            <div className="mb-2">
                {config.icon}
            </div>
            <p className={`text-xl font-bold ${config.textColor}`}>{verdict}</p>
        </div>
    );
}
