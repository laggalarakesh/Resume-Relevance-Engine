import React from 'react';
import type { AnalysisResult } from '../types';
import { AnalysisGauge } from './ScoreCard';
import { FeedbackBreakdown } from './VerdictCard';

interface ResultsDashboardProps {
  result: AnalysisResult;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  return (
    <div className="space-y-8">
      <AnalysisGauge score={result.relevanceScore} verdict={result.verdict} />
      <FeedbackBreakdown result={result} />
    </div>
  );
};