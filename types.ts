export interface Paper {
  id: string;
  title: string;
  authors: string[];
  date: string;
  abstract: string;
  source?: string;
  url?: string;
  tags?: string[];
  // For simulated full text in this demo
  fullText?: string; 
  citationCount?: number;
}

export interface Note {
  id: string;
  paperId: string;
  content: string;
  createdAt: number;
}

export interface SearchResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  PAPER_DETAIL = 'PAPER_DETAIL',
  COMPARISON = 'COMPARISON',
  LIBRARY = 'LIBRARY'
}

export interface LoadingState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}