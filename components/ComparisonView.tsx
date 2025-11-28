import React, { useEffect, useState } from 'react';
import { Paper, LoadingState } from '../types';
import { comparePapers } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ComparisonViewProps {
  papers: Paper[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ papers, onRemove, onClose }) => {
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ status: 'idle' });

  useEffect(() => {
    const runComparison = async () => {
      if (papers.length !== 2) return;
      
      setLoading({ status: 'loading' });
      try {
        const p1 = papers[0];
        const p2 = papers[1];
        const text1 = p1.fullText || p1.abstract;
        const text2 = p2.fullText || p2.abstract;
        
        const result = await comparePapers(p1.title, text1, p2.title, text2);
        setComparisonResult(result);
        setLoading({ status: 'success' });
      } catch (e) {
        setLoading({ status: 'error', message: 'Comparison failed' });
      }
    };

    runComparison();
  }, [papers]);

  if (papers.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh]">
            <h2 className="text-xl font-bold text-secondary-800">No papers selected</h2>
            <button onClick={onClose} className="mt-4 text-primary-600 hover:underline">Return to Dashboard</button>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-90px)] flex flex-col">
       <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-3xl font-serif font-black text-secondary-900">Comparative Analysis</h1>
            <p className="text-secondary-500">Side-by-side evaluation powered by Gemini Pro</p>
         </div>
         <button 
           onClick={onClose} 
           className="px-4 py-2 bg-white border border-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors shadow-sm font-medium text-sm"
        >
            Exit Comparison
         </button>
       </div>

       <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
          {/* Left: Source Material */}
          <div className="bg-white rounded-2xl shadow-xl shadow-secondary-200/30 border border-white overflow-hidden flex flex-col">
             <div className="grid grid-cols-2 border-b border-secondary-100">
                {papers.map((p, idx) => (
                    <div key={p.id} className={`p-5 ${idx === 0 ? 'border-r border-secondary-100' : ''} bg-secondary-50/30`}>
                        <div className="flex justify-between items-start mb-3">
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-primary-100 text-primary-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                {idx + 1}
                             </div>
                             <button onClick={() => onRemove(p.id)} className="text-secondary-400 hover:text-red-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                             </button>
                        </div>
                        <h3 className="font-serif font-bold text-secondary-900 text-sm mb-1 leading-snug line-clamp-2" title={p.title}>{p.title}</h3>
                        <p className="text-xs text-secondary-500 font-medium truncate">{p.authors.join(', ')}</p>
                    </div>
                ))}
                {papers.length < 2 && (
                    <div className="p-5 flex flex-col items-center justify-center text-secondary-400 text-sm border-l border-secondary-100 bg-secondary-50/10">
                        <span className="mb-2 text-2xl opacity-20">+</span>
                        Select another paper
                    </div>
                )}
             </div>
             
             <div className="flex-1 overflow-y-auto p-5">
                 <div className="grid grid-cols-2 gap-8 h-full">
                    {papers.map((p, idx) => (
                        <div key={p.id} className={`text-xs leading-relaxed text-secondary-600 ${idx === 0 ? 'border-r border-secondary-100 pr-4' : 'pl-0'}`}>
                            <h4 className="font-bold mb-3 text-secondary-900 uppercase tracking-wider text-[10px]">Abstract</h4>
                            {p.abstract}
                        </div>
                    ))}
                 </div>
             </div>
          </div>

          {/* Right: AI Synthesis */}
          <div className="bg-secondary-900 rounded-2xl shadow-2xl shadow-secondary-900/20 border border-secondary-800 overflow-hidden flex flex-col text-secondary-100 relative ring-1 ring-white/10">
             <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary-500/20 rounded-lg text-primary-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.97 15.03a.75.75 0 011.06 1.94l-1.94 1.94a.75.75 0 01-1.06-1.06l1.94-1.94z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="font-bold tracking-wide text-sm text-white">Gemini Synthesis</h3>
                </div>
                {loading.status === 'success' && <span className="text-[10px] bg-primary-500/20 text-primary-200 px-2 py-1 rounded border border-primary-500/30">Analysis Complete</span>}
             </div>

             <div className="flex-1 overflow-y-auto p-8 relative z-10">
                {loading.status === 'loading' && (
                    <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-80">
                        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-400 rounded-full animate-spin"></div>
                        <p className="text-sm font-light text-secondary-300 animate-pulse">Detecting semantic correlations...</p>
                    </div>
                )}
                
                {comparisonResult && (
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-primary-200 prose-strong:text-white prose-p:text-secondary-300">
                         <MarkdownRenderer content={comparisonResult} />
                    </div>
                )}
             </div>
             
             {/* Decorative background glow */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3"></div>
          </div>
       </div>
    </div>
  );
};