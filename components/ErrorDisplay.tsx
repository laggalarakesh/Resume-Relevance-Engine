import React from 'react';

const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

interface ErrorDisplayProps {
  message: string;
  icon?: React.ReactNode;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, icon }) => {
  const displayIcon = icon || <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />;
  
  return (
    <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg flex items-center justify-center gap-3 text-center animate-fade-in">
      {displayIcon}
      <span>{message}</span>
    </div>
  );
};
