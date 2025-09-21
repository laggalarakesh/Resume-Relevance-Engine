import React from 'react';

const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);


export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center my-12 animate-fade-in" aria-live="polite">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-2 border-sky-500/30 rounded-full animate-pulse"></div>
        <div className="absolute inset-2 border-2 border-sky-500/30 rounded-full animate-pulse delay-200"></div>
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-t from-sky-500/50 to-transparent animate-spin" 
          style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 50%, 0% 50%)', animationDuration: '1.5s', animationTimingFunction: 'linear' }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-sky-400">
           <DocumentTextIcon className="w-8 h-8 opacity-70" />
        </div>
      </div>
      <p className="mt-6 text-lg font-semibold text-slate-700 dark:text-slate-300">Scanning Documents...</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">Calibrating relevance score, please wait.</p>
    </div>
  );
};