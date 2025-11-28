import React, { useState, useEffect } from 'react';
import { Paper, SearchResult, LoadingState } from '../types';
import { searchPapers } from '../services/geminiService';
import { PaperCard } from './PaperCard';
import { MarkdownRenderer } from './MarkdownRenderer';

interface DashboardProps {
  papers: Paper[];
  onViewPaper: (paper: Paper) => void;
  onToggleCompare: (paper: Paper) => void;
  comparisonList: Paper[];
  initialSearchQuery?: string;
  onAuthorClick: (author: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ papers, onViewPaper, onToggleCompare, comparisonList, initialSearchQuery, onAuthorClick }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [loadingState, setLoadingState] = useState<LoadingState>({ status: 'idle' });
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      performSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const performSearch = async (query: string) => {
    setLoadingState({ status: 'loading', message: `Analyzing academic sources for: ${query}...` });
    try {
      const result = await searchPapers(query);
      setSearchResult(result);
      setLoadingState({ status: 'success' });
    } catch (error) {
      setLoadingState({ status: 'error', message: 'Failed to fetch results. Please try again.' });
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    performSearch(searchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero & Search */}
      <div className="flex flex-col items-center justify-center mb-16 text-center animate-slide-up">
        <h1 className="text-5xl md:text-6xl font-serif font-black text-secondary-900 mb-6 tracking-tight">
          Unlock Human <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-400">Knowledge</span>
        </h1>
        <p className="text-xl text-secondary-500 mb-10 max-w-2xl font-light leading-relaxed">
          Navigate the world's research with AI-powered insights. Compare, analyze, and synthesize complex papers in seconds.
        </p>
        
        <form onSubmit={handleSearch} className="w-full max-w-3xl relative group z-20">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-secondary-400 group-focus-within:text-primary-500 transition-colors">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What are you researching today?"
            className="w-full h-16 pl-16 pr-20 rounded-2xl border-0 bg-white shadow-xl shadow-secondary-200/50 focus:ring-4 focus:ring-primary-100 text-lg text-secondary-800 placeholder:text-secondary-400 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={loadingState.status === 'loading'}
            className="absolute right-3 top-3 bottom-3 aspect-square bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-70 shadow-md hover:shadow-lg active:scale-95"
          >
            {loadingState.status === 'loading' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            )}
          </button>
        </form>
        
        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center animate-fade-in delay-100">
          {["Generative AI", "Climate Science", "Quantum Mechanics", "Neuroscience"].map((tag) => (
             <button 
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  performSearch(tag);
                }}
                className="px-4 py-1.5 rounded-full bg-white border border-secondary-200 text-sm font-medium text-secondary-600 hover:border-primary-300 hover:text-primary-600 hover:shadow-sm transition-all"
             >
               {tag}
             </button>
          ))}
        </div>
      </div>

      {/* Search Results Area */}
      {searchResult && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-secondary-200/40 border border-white mb-16 animate-scale-in">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-secondary-100">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                 </svg>
               </div>
               <h2 className="text-2xl font-serif font-bold text-secondary-900">Research Synthesis</h2>
             </div>
             <button 
                onClick={() => { setSearchResult(null); setSearchQuery(''); }}
                className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors"
             >
               Clear Analysis
             </button>
          </div>
         
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <MarkdownRenderer content={searchResult.text} />
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-secondary-50/50 rounded-2xl p-6 border border-secondary-100">
                <h3 className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-4">Cited Sources</h3>
                {searchResult.groundingChunks.length > 0 ? (
                  <ul className="space-y-4">
                    {searchResult.groundingChunks.map((chunk, idx) => (
                      <li key={idx} className="group">
                        <a 
                          href={chunk.web?.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex gap-3 items-start"
                        >
                           <div className="mt-1 w-5 h-5 rounded-full bg-white border border-secondary-200 flex items-center justify-center text-xs font-bold text-secondary-400 group-hover:border-primary-400 group-hover:text-primary-600 transition-colors">
                             {idx + 1}
                           </div>
                           <div className="flex-1 min-w-0">
                             <span className="font-semibold text-secondary-800 text-sm group-hover:text-primary-700 transition-colors leading-snug block mb-0.5 truncate">
                               {chunk.web?.title || 'Unknown Source'}
                             </span>
                             <span className="text-secondary-400 text-xs truncate block font-mono">
                               {chunk.web?.uri ? new URL(chunk.web.uri).hostname : ''}
                             </span>
                           </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-secondary-400 italic">AI synthesis generated without direct web citations.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Default List */}
      <div className="flex items-end justify-between mb-8 border-b border-secondary-200 pb-4">
        <div>
           <h2 className="text-3xl font-serif font-bold text-secondary-900">Trending Research</h2>
           <p className="text-secondary-500 mt-1">Curated high-impact papers from top journals.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <span className="text-xs font-medium text-secondary-400 self-center mr-2">FILTER BY:</span>
           <button onClick={() => onAuthorClick("Artificial Intelligence")} className="px-3 py-1 text-xs font-bold bg-white border border-secondary-200 hover:border-primary-400 hover:text-primary-700 rounded-lg text-secondary-600 transition-all uppercase tracking-wide">AI & ML</button>
           <button onClick={() => onAuthorClick("CRISPR")} className="px-3 py-1 text-xs font-bold bg-white border border-secondary-200 hover:border-primary-400 hover:text-primary-700 rounded-lg text-secondary-600 transition-all uppercase tracking-wide">Biology</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {papers.map((paper) => (
          <PaperCard 
            key={paper.id} 
            paper={paper} 
            onView={onViewPaper}
            onToggleCompare={onToggleCompare}
            isSelectedForComparison={comparisonList.some(p => p.id === paper.id)}
            onAuthorClick={onAuthorClick}
          />
        ))}
      </div>
    </div>
  );
};