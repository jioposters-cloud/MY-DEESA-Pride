import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface ExternalViewProps {
  title: string;
  url: string;
  onBack: () => void;
}

export default function ExternalView({ title, url, onBack }: ExternalViewProps) {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-4 h-14 bg-white shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center">
          <button onClick={onBack} className="text-[#b71700] p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black tracking-tighter text-[#b71700] ml-2 uppercase">{title}</h1>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-[#b71700] p-2 transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </header>
      <div className="flex-1 w-full relative">
        <iframe 
          src={url} 
          className="absolute inset-0 w-full h-full border-none"
          title={title}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
