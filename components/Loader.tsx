
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center my-12 animate-fade-in">
      <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Analyzing...</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">The AI is reviewing the documents. This may take a moment.</p>
    </div>
  );
};
