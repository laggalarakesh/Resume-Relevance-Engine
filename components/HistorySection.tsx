import React from 'react';
import type { HistoryEntry } from '../types';
import { HistoryItem } from './HistoryItem';

const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const NoHistory: React.FC = () => (
    <div className="text-center py-10 px-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
        <HistoryIcon className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500" />
        <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">No History Yet</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your past analysis results will appear here once you run an analysis.</p>
    </div>
);


interface HistorySectionProps {
    history: HistoryEntry[];
    onDelete: (id: string) => void;
    onLoad: (entry: HistoryEntry) => void;
    onClearAll: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ history, onDelete, onLoad, onClearAll }) => {
    const handleClearConfirm = () => {
        if (window.confirm('Are you sure you want to delete all analysis history? This action cannot be undone.')) {
            onClearAll();
        }
    };
    
    return (
        <section aria-labelledby="history-heading">
            <div className="flex justify-between items-center mb-4">
                <h2 id="history-heading" className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                    <HistoryIcon className="w-7 h-7 text-sky-500" />
                    Analysis History
                </h2>
                {history.length > 0 && (
                     <button
                        onClick={handleClearConfirm}
                        className="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 rounded-md hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
                        aria-label="Clear all history"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <NoHistory />
            ) : (
                <div className="space-y-3">
                    {history.map(entry => (
                        <HistoryItem
                            key={entry.id}
                            entry={entry}
                            onDelete={onDelete}
                            onLoad={onLoad}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};