import React from 'react';
import { Paper } from '../types';

interface PaperCardProps {
  paper: Paper;
  onView: (paper: Paper) => void;
  onToggleCompare: (paper: Paper) => void;
  onAuthorClick: (author: string) => void;
  isSelectedForComparison: boolean;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper, onView, onToggleCompare, onAuthorClick, isSelectedForComparison }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-secondary-100/50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-secondary-200/50 hover:-translate-y-1 flex flex-col h-full group relative overflow-hidden"
    >
      <div className="flex-1 z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center rounded-md bg-secondary-50 px-2.5 py-1 text-xs font-bold text-secondary-600 border border-secondary-100 tracking-wide uppercase">
            {paper.source || 'Journal'}
          </span>
          <span className="text-xs font-mono text-secondary-400">{paper.date}</span>
        </div>
        
        <h3 
          className="text-xl font-serif font-bold text-secondary-900 mb-3 leading-snug cursor-pointer hover:text-primary-700 transition-colors" 
          onClick={() => onView(paper)}
        >
          {paper.title}
        </h3>
        
        {/* Authors */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {paper.authors.slice(0, 3).map((author, index) => (
            <button 
              key={index}
              onClick={(e) => { e.stopPropagation(); onAuthorClick(author); }}
              className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary-50 text-secondary-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              {author}
            </button>
          ))}
          {paper.authors.length > 3 && (
            <span className="text-xs text-secondary-400 self-center pl-1">+{paper.authors.length - 3} more</span>
          )}
        </div>

        <p className="text-sm text-secondary-600 line-clamp-4 leading-relaxed opacity-90 mb-4">
          {paper.abstract}
        </p>
      </div>
      
      <div className="pt-4 mt-auto border-t border-secondary-50 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
           {paper.citationCount !== undefined && (
             <span className="text-xs font-medium text-secondary-400 flex items-center gap-1.5 bg-secondary-50 px-2 py-1 rounded-md">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                 <path d="M10 2a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 2zM5 8a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 015 8z" /> 
                 <path fillRule="evenodd" d="M3.75 2A1.75 1.75 0 002 3.75v12.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 16.25V3.75A1.75 1.75 0 0016.25 2H3.75zM3.5 3.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v12.5a.25.25 0 01-.25.25H3.75a.25.25 0 01-.25-.25V3.75z" clipRule="evenodd" />
               </svg>
               {new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(paper.citationCount)}
             </span>
           )}
        </div>
        
        <div className="flex gap-2">
            <button
            onClick={() => onToggleCompare(paper)}
            className={`p-2 rounded-lg transition-all ${
                isSelectedForComparison 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'text-secondary-400 hover:bg-secondary-50 hover:text-primary-600'
            }`}
            title="Compare Paper"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            </button>
            <button 
                onClick={() => onView(paper)}
                className="px-4 py-2 rounded-lg bg-secondary-900 text-white text-sm font-medium hover:bg-primary-600 transition-colors shadow-sm"
            >
                Read
            </button>
        </div>
      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};