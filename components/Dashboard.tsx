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
      {/* Search Section - Centered, Minimal, Robust */}
      <div className="flex flex-col items-center justify-center mb-16 animate-fade-in">
        
        {/* The Search Bar Container */}
        <div className="w-full max-w-4xl relative z-20">
          <form onSubmit={handleSearch} className="relative group">
            {/* Glow effect behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-200 via-indigo-200 to-primary-200 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-secondary-900/5 border border-secondary-100 p-2 transition-transform duration-200 focus-within:scale-[1.01]">
              
              {/* Search Icon */}
              <div className="pl-4 pr-3 text-secondary-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>

              {/* Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for papers, authors, or research topics..."
                className="flex-1 h-12 bg-transparent border-none outline-none text-lg text-secondary-900 placeholder:text-secondary-400 font-medium"
              />

              {/* Right Side Actions / Button */}
              <div className="flex items-center gap-2 pr-2">
                 {/* Clear button if text exists */}
                 {searchQuery && (
                   <button
                     type="button"
                     onClick={() => setSearchQuery('')}
                     className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-full transition-colors"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                       <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                     </svg>
                   </button>
                 )}

                 {/* Submit Button */}
                 <button 
                  type="submit"
                  disabled={loadingState.status === 'loading'}
                  className="px-6 py-2.5 bg-secondary-900 hover:bg-primary-600 text-white rounded-xl font-medium shadow-lg shadow-secondary-900/20 hover:shadow-primary-600/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  {loadingState.status === 'loading' ? (
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Search</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Helper Text / Quick Tags below */}
          <div className="mt-4 flex flex-wrap justify-center gap-y-2 gap-x-4 text-sm text-secondary-500 animate-fade-in delay-100">
             <span className="opacity-60 italic">Try searching:</span>
             {["Generative AI", "Climate Science", "Quantum Mechanics", "Neuroscience"].map(tag => (
               <button
                 key={tag}
                 onClick={() => { setSearchQuery(tag); performSearch(tag); }}
                 className="hover:text-primary-600 hover:underline decoration-primary-300 underline-offset-4 transition-colors font-medium text-secondary-600"
               >
                 {tag}
               </button>
             ))}
          </div>
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