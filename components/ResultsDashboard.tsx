
import React from 'react';
import type { AnalysisResult } from '../types';
import { ScoreCard } from './ScoreCard';
import { VerdictCard } from './VerdictCard';
import { FeedbackList } from './FeedbackList';

interface ResultsDashboardProps {
  result: AnalysisResult;
}

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.421-.62-2.897-1.49-4.243-2.583a48.01 48.01 0 0 1-1.9-1.902A48.01 48.01 0 0 1 2.25 12c0-1.786.64-3.56 1.8-5.019a48.01 48.01 0 0 1 1.9-1.902A48.01 48.01 0 0 1 7.5 3c1.786 0 3.56.64 5.02 1.802a48.01 48.01 0 0 1 1.899 1.902A48.01 48.01 0 0 1 16.5 12c0 1.786-.64 3.56-1.8 5.019a48.01 48.01 0 0 1-1.9 1.902a48.01 48.01 0 0 1-4.243 2.583Z" />
  </svg>
);
const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);


export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const missingItems = [
    ...result.missingSkills.map(item => ({ type: 'Skill', text: item })),
    ...result.missingProjects.map(item => ({ type: 'Project', text: item })),
    ...result.missingCertifications.map(item => ({ type: 'Certification', text: item }))
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard score={result.relevanceScore} />
        <VerdictCard verdict={result.verdict} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeedbackList
          title="Identified Gaps"
          items={missingItems.length > 0 ? missingItems.map(i => i.text) : ["No significant gaps identified. Well done!"]}
          icon={<XCircleIcon className="w-6 h-6 text-amber-500" />}
          color="amber"
        />
        <FeedbackList
          title="Improvement Suggestions"
          items={result.improvementSuggestions}
          icon={<LightBulbIcon className="w-6 h-6 text-green-500" />}
          color="green"
        />
      </div>
    </div>
  );
};
