import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { fetchDirectoryData } from '../services/sheetService';
import { DirectoryItem } from '../types';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your MyDeesa Assistant. How can I help you find information about Deesa today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [directoryData, setDirectoryData] = useState<DirectoryItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchDirectoryData();
      setDirectoryData(data);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    if (directoryData.length === 0) {
      setMessages(prev => [...prev, 
        { role: 'user', content: userMessage },
        { role: 'assistant', content: "I'm still loading the directory data. Please wait a moment and try again." }
      ]);
      setInput('');
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Prepare context from directory data
      const context = directoryData.map(item => 
        `Name: ${item.name}, Category: ${item.category}, SubCategory: ${item.subCategory}, Info: ${item.info}, Location: ${item.location}, Mobile: ${item.mobile}`
      ).join('\n').slice(0, 30000); // Increased limit slightly

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          parts: [{
            text: `You are the MyDeesa AI Assistant, a helpful guide for the city of Deesa, Gujarat. 
            Your goal is to help users find information about local services, shops, jobs, and rentals in Deesa.
            
            Here is the current directory data for Deesa:
            ${context}
            
            User Question: ${userMessage}
            
            Instructions:
            1. Use the provided directory data to answer questions.
            2. If you find matching items, provide their names and relevant details (like mobile or location).
            3. If you don't find a specific match, suggest related categories or general advice about Deesa.
            4. Keep your tone helpful, professional, and local.
            5. Answer in English, but you can use common Gujarati/Hindi terms if appropriate.
            6. Be concise.`
          }]
        }],
        config: {
          systemInstruction: "You are a helpful local assistant for Deesa city. You help users find shops, services, and info from the MyDeesa directory.",
        }
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col md:items-end md:justify-end md:p-6 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto md:hidden"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="relative w-full h-full md:h-[600px] md:w-[400px] bg-white md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-[#b71700] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tight">MyDeesa AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 text-green-400">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    msg.role === 'assistant' ? "bg-red-50 text-[#b71700]" : "bg-blue-50 text-blue-600"
                  )}>
                    {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'assistant' 
                      ? "bg-white text-gray-800 rounded-tl-none" 
                      : "bg-[#b71700] text-white rounded-tr-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#b71700] flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#b71700]" />
                    <span className="text-xs font-medium text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about shops, jobs, services..."
                  className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-[#b71700]/20 rounded-2xl py-4 pl-5 pr-14 text-sm placeholder-gray-400"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2.5 bg-[#b71700] text-white rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[9px] text-center text-gray-400 mt-3 uppercase font-bold tracking-widest flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Powered by MyDeesa Local Intelligence
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
