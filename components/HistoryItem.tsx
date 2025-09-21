import React, { useState } from 'react';
import type { HistoryEntry } from '../types';
import { ResultsDashboard } from './ResultsDashboard';

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const ArrowUpOnSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
  </svg>
);

const verdictStyles = {
    'High Suitability': {
        bg: 'bg-green-500',
        text: 'text-green-700 dark:text-green-300',
        textTag: 'bg-green-100 dark:bg-green-900/40'
    },
    'Medium Suitability': {
        bg: 'bg-amber-500',
        text: 'text-amber-700 dark:text-amber-300',
        textTag: 'bg-amber-100 dark:bg-amber-900/40'
    },
    'Low Suitability': {
        bg: 'bg-red-500',
        text: 'text-red-700 dark:text-red-300',
        textTag: 'bg-red-100 dark:bg-red-900/40'
    },
};

interface HistoryItemProps {
    entry: HistoryEntry;
    onDelete: (id: string) => void;
    onLoad: (entry: HistoryEntry) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ entry, onDelete, onLoad }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { result, timestamp, id } = entry;
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString(undefined, {
        hour: '2-digit', minute: '2-digit'
    });
    
    const verdictStyle = verdictStyles[result.verdict] || verdictStyles['Medium Suitability'];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                aria-expanded={isOpen}
                aria-controls={`history-content-${id}`}
            >
                <div className="flex items-center gap-4 flex-grow min-w-0">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white ${verdictStyle.bg}`}>
                        {result.relevanceScore}%
                    </div>
                    <div className="flex flex-col items-start flex-grow min-w-0">
                         <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${verdictStyle.text} ${verdictStyle.textTag}`}>
                            {result.verdict}
                        </span>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{formattedDate} at {formattedTime}</p>
                    </div>
                </div>
                 <ChevronDownIcon className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                id={`history-content-${id}`}
                className={`transition-all duration-300 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                        <ResultsDashboard result={result} />
                    </div>
                    <div className="p-4 flex justify-end items-center gap-3 bg-slate-100 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => onLoad(entry)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 hover:bg-sky-200 dark:hover:bg-sky-800/70 transition-colors"
                        >
                           <ArrowUpOnSquareIcon className="w-4 h-4" /> Load this Analysis
                        </button>
                        <button
                             onClick={() => onDelete(id)}
                             className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800/70 transition-colors"
                        >
                            <TrashIcon className="w-4 h-4" /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};