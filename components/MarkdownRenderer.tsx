import React from 'react';

// Enhanced markdown renderer with improved regex styling and support for more markdown features
export const MarkdownRenderer: React.FC<{ content: string, className?: string }> = ({ content, className = '' }) => {
  const processText = (text: string) => {
    let processed = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-3 tracking-tight">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-slate-900 mt-8 mb-4 pb-2 border-b border-slate-200 tracking-tight">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-slate-900 mt-8 mb-6 tracking-tight">$1</h1>')
      
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-academic-500 pl-4 italic text-slate-700 my-4 py-1 bg-slate-50 rounded-r">$1</blockquote>')
      
      // Horizontal Rule
      .replace(/^---$/gim, '<hr class="my-8 border-slate-200" />')
      
      // Code Blocks
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono leading-relaxed shadow-sm scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">$1</pre>')
      
      // Lists (Unordered) - Using flex divs for better bullet alignment without UL tags
      .replace(/^\s*-\s+(.*$)/gim, '<div class="flex gap-3 mb-2 text-slate-700 group"><span class="text-academic-500 font-bold mt-1.5 leading-none">•</span><div class="flex-1 leading-relaxed">$1</div></div>')
      
      // Lists (Ordered)
      .replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div class="flex gap-3 mb-2 text-slate-700"><span class="text-academic-500 font-mono font-bold text-sm mt-0.5 min-w-[1.2em] text-right">$1.</span><div class="flex-1 leading-relaxed">$2</div></div>')
      
      // Inline styles
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-slate-700">$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="bg-slate-100 text-academic-700 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-academic-600 hover:text-academic-800 hover:underline decoration-academic-300 decoration-2 underline-offset-2 transition-colors font-medium">$1</a>')
      
      // Paragraph spacing (double newline)
      .replace(/\n\n/gim, '<div class="h-4"></div>');

    return { __html: processed };
  };

  return (
    <div 
      className={`font-sans leading-relaxed text-slate-600 ${className}`} 
      dangerouslySetInnerHTML={processText(content)} 
    />
  );
};