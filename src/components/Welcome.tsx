import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Verified } from 'lucide-react';

interface WelcomeProps {
  onExplore: () => void;
}

export default function Welcome({ onExplore }: WelcomeProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-[#f8f9ff]">
      {/* Background Layering */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#b71700]/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-[#fedf36]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[5%] left-[15%] w-[25%] h-[25%] bg-blue-100/50 rounded-full blur-[80px]"></div>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md w-full text-center space-y-12"
      >
        {/* Logo Cluster */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-[#b71700]/10 blur-2xl rounded-full scale-150"></div>
          <div className="relative flex flex-col items-center">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none select-none">
              <span className="text-[#b71700]">My</span><span className="text-[#e3c614]">Deesa</span>
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-[2px] w-8 bg-[#b71700]/20"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Digital Concierge</span>
              <span className="h-[2px] w-8 bg-[#b71700]/20"></span>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight px-4">
            Your local ecosystem, curated for excellence.
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed px-8 opacity-80">
            Discover properties, services, and local connections with our high-end editorial directory.
          </p>
        </div>

        {/* Interaction Area */}
        <div className="flex flex-col items-center gap-6 w-full pt-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExplore}
            className="group relative w-full max-w-[280px] h-14 bg-[#b71700] text-white rounded-full font-bold text-sm tracking-widest uppercase flex items-center justify-center transition-all shadow-[0_8px_24px_rgba(183,23,0,0.15)] hover:shadow-[0_12px_32px_rgba(183,23,0,0.25)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Deesa
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fedf36] animate-pulse"></span>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center max-w-[300px] leading-relaxed">
              Brought to you by Dr.Ankit M.Patel | IMAX DENTAL 3D LAB, Managed by Team MyDeesa
            </span>
          </div>
        </div>
      </motion.div>


      {/* Floating Accent Cards (Desktop Only) */}
      <div className="fixed top-24 -right-12 hidden lg:block">
        <motion.div 
          animate={{ rotate: [12, 15, 12] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-64 aspect-square bg-white rounded-3xl flex flex-col p-6 shadow-xl shadow-red-900/5"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#fedf36]/20 flex items-center justify-center mb-6">
            <Star className="w-6 h-6 text-[#6d5e00] fill-[#6d5e00]" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 bg-gray-100 rounded-full"></div>
            <div className="h-2 w-1/2 bg-gray-100 rounded-full"></div>
            <div className="h-2 w-2/3 bg-gray-100 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-24 -left-16 hidden lg:block">
        <motion.div 
          animate={{ rotate: [-6, -9, -6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-56 aspect-[4/3] bg-[#b71700] text-white rounded-3xl flex flex-col p-6 shadow-2xl shadow-red-900/20"
        >
          <div className="flex justify-between items-start mb-auto">
            <Verified className="w-8 h-8" />
            <span className="text-xs font-black tracking-widest uppercase">Verified</span>
          </div>
          <div className="text-xl font-bold leading-tight">Elite Partners 2024</div>
        </motion.div>
      </div>
    </div>
  );
}
