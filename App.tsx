import React, { useState } from 'react';
import { Paper, Note, ViewMode } from './types';
import { Dashboard } from './components/Dashboard';
import { PaperDetail } from './components/PaperDetail';
import { ComparisonView } from './components/ComparisonView';

// Mock Data for initial view
const MOCK_PAPERS: Paper[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    authors: ['Vaswani', 'Shazeer', 'Parmar', 'Uszkoreit', 'Jones', 'Gomez', 'Kaiser', 'Polosukhin'],
    date: '2017',
    source: 'NeurIPS',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    fullText: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU.',
    citationCount: 85000
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Devlin', 'Chang', 'Lee', 'Toutanova'],
    date: '2019',
    source: 'NAACL',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
    fullText: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models (Peters et al., 2018a; Radford et al., 2018), BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers. As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of tasks, such as question answering and language inference, without substantial task-specific architecture modifications.',
    citationCount: 72000
  },
  {
    id: '3',
    title: 'Language Models are Few-Shot Learners',
    authors: ['Brown', 'Mann', 'Ryder', 'Subbiah', 'Kaplan', 'Dhariwal', 'Neelakantan', 'Shyam', 'Sastry', 'Askell'],
    date: '2020',
    source: 'NeurIPS',
    abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples. By contrast, humans can generally perform a new language task from only a few examples or from simple instructions - something which current NLP systems still largely struggle to do.',
    fullText: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples. By contrast, humans can generally perform a new language task from only a few examples or from simple instructions.',
    citationCount: 25000
  }
];

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [comparisonList, setComparisonList] = useState<Paper[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');

  const handleViewPaper = (paper: Paper) => {
    setSelectedPaper(paper);
    setViewMode(ViewMode.PAPER_DETAIL);
  };

  const handleToggleCompare = (paper: Paper) => {
    setComparisonList((prev) => {
      const isSelected = prev.some((p) => p.id === paper.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== paper.id);
      }
      if (prev.length >= 2) {
        alert("You can only compare up to 2 papers.");
        return prev;
      }
      return [...prev, paper];
    });
  };

  const handleRemoveCompare = (id: string) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [...prev, note]);
  };

  const handleAuthorClick = (authorName: string) => {
    setActiveSearchQuery(`author: "${authorName}"`);
    setViewMode(ViewMode.DASHBOARD);
  };

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.DASHBOARD:
        return (
          <Dashboard
            papers={MOCK_PAPERS}
            onViewPaper={handleViewPaper}
            onToggleCompare={handleToggleCompare}
            comparisonList={comparisonList}
            initialSearchQuery={activeSearchQuery}
            onAuthorClick={handleAuthorClick}
          />
        );
      case ViewMode.PAPER_DETAIL:
        return selectedPaper ? (
          <PaperDetail
            paper={selectedPaper}
            onBack={() => setViewMode(ViewMode.DASHBOARD)}
            notes={notes}
            onAddNote={handleAddNote}
            onAuthorClick={handleAuthorClick}
          />
        ) : (
          <div className="flex h-screen items-center justify-center text-secondary-400">Paper not found</div>
        );
      case ViewMode.COMPARISON:
        return (
          <ComparisonView
            papers={comparisonList}
            onRemove={handleRemoveCompare}
            onClose={() => setViewMode(ViewMode.DASHBOARD)}
          />
        );
      default:
        return <div className="text-center py-20">Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 font-sans relative bg-dot-pattern">
      {/* Decorative gradient overlay */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-white/80 z-0"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-secondary-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
                setActiveSearchQuery('');
                setViewMode(ViewMode.DASHBOARD);
            }}
          >
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-serif font-black text-xl shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-tight text-secondary-900 leading-none group-hover:text-primary-700 transition-colors">
                ScholarSync
              </span>
              <span className="text-[10px] font-medium text-secondary-500 tracking-wider uppercase mt-0.5">Research Assistant</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-secondary-600">
              <button onClick={() => setViewMode(ViewMode.DASHBOARD)} className="hover:text-primary-600 transition-colors">Discover</button>
              <button className="hover:text-primary-600 transition-colors opacity-50 cursor-not-allowed">My Library</button>
            </nav>

            {comparisonList.length > 0 && (
              <button 
                onClick={() => setViewMode(ViewMode.COMPARISON)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                  viewMode === ViewMode.COMPARISON 
                    ? 'bg-primary-600 text-white shadow-primary-500/25 ring-2 ring-primary-100' 
                    : 'bg-white border border-secondary-200 text-secondary-700 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                <span>Compare ({comparisonList.length})</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 animate-fade-in pb-12">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;