
import React from 'react';

interface FeedbackListProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  color: 'green' | 'amber';
}

const colorStyles = {
    green: {
        border: 'border-l-green-500',
        text: 'text-green-800 dark:text-green-200'
    },
    amber: {
        border: 'border-l-amber-500',
        text: 'text-amber-800 dark:text-amber-200'
    }
}

export const FeedbackList: React.FC<FeedbackListProps> = ({ title, items, icon, color }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className={`pl-4 border-l-4 ${colorStyles[color].border} text-slate-600 dark:text-slate-300`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
