import React, { useState } from 'react';
import { Paper, Note, LoadingState } from '../types';
import { analyzePaper, generateCitationFormats } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';

interface PaperDetailProps {
  paper: Paper;
  onBack: () => void;
  notes: Note[];
  onAddNote: (note: Note) => void;
  onAuthorClick: (author: string) => void;
}

export const PaperDetail: React.FC<PaperDetailProps> = ({ paper, onBack, notes, onAddNote, onAuthorClick }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [citations, setCitations] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ status: 'idle' });
  const [citationLoading, setCitationLoading] = useState<boolean>(false);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'insights'>('text');
  const [showCitationModal, setShowCitationModal] = useState(false);

  const paperNotes = notes.filter(n => n.paperId === paper.id);

  const handleAnalyze = async () => {
    setLoading({ status: 'loading' });
    try {
      const hasFullText = !!(paper.fullText && paper.fullText.trim().length > 0);
      const content = hasFullText 
        ? paper.fullText 
        : `Title: ${paper.title}\n\nAbstract: ${paper.abstract}`;
      const contextPrefix = hasFullText
        ? "Analyze the following full academic paper text:"
        : "Analyze the following academic paper abstract (full text unavailable):";

      const textToAnalyze = `${contextPrefix}\n\n${content}`;
      const result = await analyzePaper(textToAnalyze);
      setAnalysis(result);
      setLoading({ status: 'success' });
    } catch (e) {
      setLoading({ status: 'error', message: 'Analysis failed' });
    }
  };

  const handleGenerateCitations = async () => {
    if (citations) {
        setShowCitationModal(true);
        return;
    }
    setCitationLoading(true);
    try {
        const result = await generateCitationFormats(paper);
        setCitations(result);
        setShowCitationModal(true);
    } catch (e) {
        console.error("Failed to generate citations");
    } finally {
        setCitationLoading(false);
    }
  };

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    onAddNote({
      id: Date.now().toString(),
      paperId: paper.id,
      content: newNote,
      createdAt: Date.now()
    });
    setNewNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-90px)] flex flex-col relative">
      {/* Citation Modal */}
      {showCitationModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-secondary-900/20 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-scale-in border border-white/50">
                <div className="flex justify-between items-center p-6 border-b border-secondary-100 bg-secondary-50/50">
                    <h3 className="text-xl font-serif font-bold text-secondary-900">Bibliographic Citations</h3>
                    <button onClick={() => setShowCitationModal(false)} className="p-2 rounded-full hover:bg-secondary-200/50 text-secondary-400 hover:text-secondary-600 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-8 overflow-y-auto bg-white">
                    {citations ? (
                        <div className="prose prose-sm prose-slate max-w-none">
                             <MarkdownRenderer content={citations} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12">
                             <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-secondary-50 border-t border-secondary-100 flex justify-end">
                    <button 
                      onClick={() => setShowCitationModal(false)} 
                      className="px-6 py-2 bg-white border border-secondary-300 rounded-xl text-secondary-700 font-medium hover:bg-secondary-50 hover:text-secondary-900 transition-colors shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
         <button 
            onClick={onBack} 
            className="group flex items-center gap-2 text-sm font-medium text-secondary-500 hover:text-primary-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-secondary-200 flex items-center justify-center shadow-sm group-hover:border-primary-200 group-hover:shadow-md transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
            </div>
            Back to Discovery
          </button>

          <div className="flex gap-3">
             <button 
                onClick={handleGenerateCitations}
                disabled={citationLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-secondary-200 text-secondary-700 rounded-xl hover:border-primary-300 hover:text-primary-600 transition-all shadow-sm font-medium text-sm"
            >
                {citationLoading ? (
                    <div className="w-4 h-4 border-2 border-secondary-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                )}
                Cite
            </button>
            <button className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20 font-medium text-sm flex items-center gap-2">
               <span>Save to Library</span>
            </button>
          </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Main Reading / Analysis Area */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-full bg-white rounded-2xl shadow-xl shadow-secondary-200/40 border border-white overflow-hidden">
            <div className="p-8 pb-0">
               <h1 className="text-3xl md:text-4xl font-serif font-black text-secondary-900 mb-4 leading-tight">{paper.title}</h1>
               <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-secondary-500 mb-8 pb-8 border-b border-secondary-100">
                   <div className="flex items-center gap-2 flex-wrap">
                      {paper.authors.map((author, index) => (
                          <React.Fragment key={index}>
                            <button onClick={() => onAuthorClick(author)} className="font-medium text-primary-600 hover:text-primary-800 hover:underline decoration-primary-300 underline-offset-2 transition-colors">
                               {author}
                            </button>
                            {index < paper.authors.length - 1 && <span className="text-secondary-300">,</span>}
                          </React.Fragment>
                      ))}
                   </div>
                   <span className="w-1 h-1 rounded-full bg-secondary-300"></span>
                   <span className="font-mono">{paper.date}</span>
                   <span className="w-1 h-1 rounded-full bg-secondary-300"></span>
                   <span className="bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{paper.source}</span>
               </div>

               {/* Tabs */}
               <div className="flex gap-8 border-b border-secondary-100">
                  <button 
                    onClick={() => setActiveTab('text')}
                    className={`pb-4 text-sm font-bold tracking-wide transition-all relative ${
                      activeTab === 'text' 
                        ? 'text-primary-600' 
                        : 'text-secondary-400 hover:text-secondary-600'
                    }`}
                  >
                    Full Text
                    {activeTab === 'text' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"></span>}
                  </button>
                  <button 
                    onClick={() => {
                       if (!analysis && loading.status === 'idle') handleAnalyze();
                       setActiveTab('insights');
                    }}
                    className={`pb-4 text-sm font-bold tracking-wide transition-all relative ${
                      activeTab === 'insights' 
                        ? 'text-primary-600' 
                        : 'text-secondary-400 hover:text-secondary-600'
                    }`}
                  >
                    AI Insights
                    {activeTab === 'insights' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"></span>}
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-6 scroll-smooth">
              {activeTab === 'text' ? (
                <div className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary-600 prose-p:leading-loose text-secondary-700">
                  <h3>Abstract</h3>
                  <p>{paper.abstract}</p>
                  <hr className="my-8 border-secondary-100" />
                  <h3>Introduction</h3>
                  <p>
                    {paper.fullText ? paper.fullText.slice(0, 2000) : "Full text content not available."}
                  </p>
                  
                  {paper.url && (
                    <div className="mt-12 p-6 bg-secondary-50 rounded-xl border border-secondary-200 text-center">
                        <p className="text-secondary-600 mb-4 font-medium">Continue reading the full paper at the source</p>
                        <a href={paper.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-secondary-300 text-secondary-800 text-sm font-bold rounded-lg hover:border-primary-400 hover:text-primary-700 hover:shadow-md transition-all">
                        Open Original Source
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                        </svg>
                        </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full">
                  {loading.status === 'loading' && (
                    <div className="flex flex-col items-center justify-center h-full space-y-6">
                      <div className="relative">
                         <div className="w-16 h-16 border-4 border-secondary-100 rounded-full"></div>
                         <div className="w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-secondary-800 font-bold text-lg">Synthesizing Research</p>
                        <p className="text-secondary-400 text-sm mt-1">Analyzing abstract and methodology...</p>
                      </div>
                    </div>
                  )}
                  {loading.status === 'error' && (
                     <div className="text-center py-20 bg-red-50/50 rounded-xl border border-red-100">
                       <p className="text-red-600 font-medium mb-3">Analysis generation failed</p>
                       <button onClick={handleAnalyze} className="text-sm font-bold text-red-700 underline hover:no-underline">Try Again</button>
                     </div>
                  )}
                  {analysis && (
                    <div className="animate-fade-in pb-12">
                       <MarkdownRenderer content={analysis} />
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>

        {/* Right: Notes Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col h-full">
          <div className="bg-white rounded-2xl shadow-lg shadow-secondary-200/30 border border-secondary-100 flex flex-col h-full overflow-hidden">
             <div className="p-5 border-b border-secondary-100 bg-secondary-50/50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                 </svg>
                 <h3 className="font-bold text-secondary-700">Marginalia</h3>
               </div>
               <span className="text-xs font-bold text-secondary-500 bg-secondary-200/50 px-2 py-1 rounded-md">{paperNotes.length}</span>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary-50/30">
               {paperNotes.length === 0 ? (
                 <div className="text-center py-12 px-8">
                    <p className="text-sm text-secondary-400 leading-relaxed">No notes yet. Capture critical thoughts and observations here for future reference.</p>
                 </div>
               ) : (
                 paperNotes.map(note => (
                   <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-secondary-100 text-sm text-secondary-700 group hover:border-primary-200 transition-colors">
                     <p className="mb-2 leading-relaxed">{note.content}</p>
                     <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] font-mono text-secondary-400">{new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     </div>
                   </div>
                 ))
               )}
             </div>

             <div className="p-4 bg-white border-t border-secondary-100">
               <textarea
                 value={newNote}
                 onChange={(e) => setNewNote(e.target.value)}
                 placeholder="Jot down an idea..."
                 className="w-full h-24 p-4 rounded-xl border border-secondary-200 bg-secondary-50 focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 outline-none text-sm resize-none mb-3 transition-all placeholder:text-secondary-400"
               ></textarea>
               <button 
                 onClick={handleSaveNote}
                 disabled={!newNote.trim()}
                 className="w-full py-2.5 bg-secondary-900 hover:bg-primary-600 text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Add Note
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};