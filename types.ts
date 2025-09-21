
export interface AnalysisResult {
  relevanceScore: number;
  verdict: 'High Suitability' | 'Medium Suitability' | 'Low Suitability';
  matchedSkills: string[];
  missingSkills: string[];
  missingProjects: string[];
  missingCertifications: string[];
  improvementSuggestions: string[];
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  jobDescription: string;
  resumeText: string;
  result: AnalysisResult;
}