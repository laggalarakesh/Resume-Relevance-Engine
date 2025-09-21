import React from 'react';

interface FeedbackCategoryProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
}

export const FeedbackCategory: React.FC<FeedbackCategoryProps> = ({ title, items, icon }) => {
  if (!items || items.length === 0) {
     if (title === "Improvement Suggestions") {
        items = ["The AI found no specific areas for improvement. The resume is a strong fit."];
     } else {
        return null;
     }
  }
  
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
      </div>
      <ul className="space-y-3 pl-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
            <svg className="w-5 h-5 mt-0.5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};