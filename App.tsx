
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsDashboard } from './components/ResultsDashboard';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { HistorySection } from './components/HistorySection';
import { analyzeResume } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import type { AnalysisResult, HistoryEntry } from './types';

const errorMatchers = [
  {
    keywords: ['api_key', 'api key not valid'],
    message: 'The provided API key is invalid. Please check your configuration.',
  },
  {
    keywords: ['rate limit', 'resource has been exhausted', '429'],
    message: 'Rate limit exceeded. Please wait a moment before trying again.',
  },
  {
    keywords: ['billing'],
    message: 'Billing is not enabled for this project. Please check your Google Cloud account.',
  },
  {
    keywords: ['candidate was blocked', 'safety'],
    message: 'The response was blocked due to safety concerns. Please adjust the input text.',
  },
  {
    keywords: ['400'],
    message: 'There was a problem with the request. Please check the provided documents and try again.',
  },
];

const parseGeminiError = (error: Error): string => {
    const lowerCaseMessage = error.message.toLowerCase();
    
    const matchedError = errorMatchers.find(matcher => 
        matcher.keywords.some(keyword => lowerCaseMessage.includes(keyword))
    );

    return matchedError ? matchedError.message : 'An unexpected error occurred. Please try again.';
};


const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('analysisHistory', []);

  const handleAnalyze = useCallback(async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setError('Please provide both a job description and a resume.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(jobDescription, resumeText);
      setAnalysisResult(result);
       const newHistoryEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        jobDescription,
        resumeText,
        result,
      };
      setHistory(prevHistory => [newHistoryEntry, ...prevHistory]);
    } catch (err) {
      console.error("Analysis Error:", err);
      let errorMessage = 'An error occurred during analysis. Please try again.';
      if (err instanceof Error) {
        errorMessage = parseGeminiError(err);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [jobDescription, resumeText, setHistory]);

  const handleLoadHistory = (entry: HistoryEntry) => {
    setJobDescription(entry.jobDescription);
    setResumeText(entry.resumeText);
    setAnalysisResult(entry.result);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(entry => entry.id !== id));
  };
  
  const handleClearHistory = () => {
    setHistory([]);
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <InputSection
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            resumeText={resumeText}
            setResumeText={setResumeText}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            setError={setError}
          />
          
          {error && <ErrorDisplay message={error} />}

          {isLoading && <Loader />}

          {analysisResult && !isLoading && (
            <div className="mt-8 animate-fade-in">
              <ResultsDashboard result={analysisResult} />
            </div>
          )}

           <div className="mt-12">
             <HistorySection 
                history={history}
                onLoad={handleLoadHistory}
                onDelete={handleDeleteHistory}
                onClearAll={handleClearHistory}
            />
           </div>
        </div>
      </main>
       <footer className="text-center p-4 mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>Powered by Gemini API</p>
        </footer>
    </div>
  );
};

export default App;
