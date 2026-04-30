import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Phone, MapPin, Globe, MessageCircle, 
  CheckCircle2, Info, Loader2, Camera, X, Megaphone, Share2
} from 'lucide-react';
import { DirectoryItem, Screen } from '../types';
import { fetchDirectoryData } from '../services/sheetService';
import { cn } from '../lib/utils';
import CategoryIcon from './CategoryIcon';
import { DirectoryCard } from './DirectoryCard';
import { ImageGallery } from './ImageGallery';

interface DirectoryListProps {
  screen: Screen;
  onBack: () => void;
  initialCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

export default function DirectoryList({ screen, onBack, initialCategory, onCategoryChange }: DirectoryListProps) {
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);
  const [galleryItem, setGalleryItem] = useState<DirectoryItem | null>(null);
  const [highlightedItem, setHighlightedItem] = useState<DirectoryItem | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchDirectoryData();
      
      // Check for deep link
      const params = new URLSearchParams(window.location.search);
      const itemName = params.get('item');
      if (itemName) {
        const item = data.find(i => i.name === itemName);
        if (item) {
          setHighlightedItem(item);
        }
      }
      
      // Filter based on screen
      const filtered = data.filter(item => {
        const cat = item.category.toLowerCase();
        if (screen === 'phonebook') return true; // Show all for phonebook but we will categorize it
        if (screen === 'rental') return cat.includes('rental');
        if (screen === 'property') return cat.includes('property');
        if (screen === 'jobs') return cat.includes('job');
        if (screen === 'food') return cat.includes('food') || cat.includes('restaurant');
        if (screen === 'realestate') return cat.includes('real estate schemes');
        if (screen === 'events') return cat.includes('events');
        return true;
      });
      
      setItems(filtered);
      setLoading(false);
      
      // Reset category selection when screen changes
      setActiveCategory(null);
      setActiveSubCategory('All');
    }
    loadData();
  }, [screen]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(item => item.category)));
    return cats.sort();
  }, [items]);

  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All');
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll categories
  useEffect(() => {
    const el = categoriesRef.current;
    if (!el || isPaused || categories.length <= 1) return;

    let frameId: number;
    const scroll = () => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += 0.5;
      }
      frameId = requestAnimationFrame(scroll);
    };

    const timeoutId = setTimeout(() => {
      frameId = requestAnimationFrame(scroll);
    }, 2000); // Start after 2s

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [isPaused, categories, screen]);

  // Sync with initialCategory prop
  useEffect(() => {
    if (initialCategory && initialCategory !== activeCategory) {
      setActiveCategory(initialCategory);
      setActiveSubCategory('All');
    }
  }, [initialCategory]);

  useEffect(() => {
    if (categories.length > 0) {
      if (initialCategory && categories.includes(initialCategory)) {
        if (activeCategory !== initialCategory) {
          setActiveCategory(initialCategory);
        }
      } else if (!activeCategory) {
        const firstCat = categories[0];
        setActiveCategory(firstCat);
        if (onCategoryChange) onCategoryChange(firstCat);
      }
    }
  }, [categories, activeCategory, initialCategory, onCategoryChange]);

  const subCategories = useMemo(() => {
    if (!activeCategory) return ['All'];
    const subs = Array.from(new Set(
      items
        .filter(item => item.category === activeCategory)
        .map(item => item.subCategory)
    ));
    return ['All', ...subs.sort()];
  }, [items, activeCategory]);

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.info.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !activeCategory || item.category === activeCategory;
    const matchesSubCategory = activeSubCategory === 'All' || item.subCategory === activeSubCategory;

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const title = screen === 'phonebook' ? 'Phonebook - MyDeesa App Diary' : 
                screen === 'realestate' ? 'Real Estate Schemes' :
                screen === 'events' ? 'Events of Deesa' :
                screen.charAt(0).toUpperCase() + screen.slice(1);

  return (
    <div className="min-h-screen bg-[#fdfbf7] pb-10">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="flex items-center px-4 h-16 max-w-5xl mx-auto gap-4">
          <button onClick={onBack} className="text-[#b71700] p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black tracking-tighter text-[#b71700] flex-1 uppercase">{title}</h1>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-5xl mx-auto space-y-6">
        {/* Search */}
        <div className="bg-white rounded-full shadow-sm flex items-center px-5 py-4 gap-3 ring-1 ring-black/5">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400" 
            placeholder={`Search in ${screen}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Horizontal Scroll */}
        {categories.length > 1 && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-[#b71700] tracking-widest uppercase">Explore Categories</h2>
              <button 
                onClick={() => setShowCategoriesModal(true)}
                className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline"
              >
                View All &gt;
              </button>
            </div>
            <div 
              ref={categoriesRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex overflow-x-auto gap-4 pb-2 no-scrollbar scroll-smooth"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveSubCategory('All');
                    if (onCategoryChange) onCategoryChange(cat);
                  }}
                  className="flex flex-col items-center gap-2 flex-shrink-0 group"
                >
                  <CategoryIcon 
                    category={cat} 
                    active={activeCategory === cat}
                    className={cn(
                      "transition-all shadow-sm ring-2 ring-transparent",
                      activeCategory === cat ? "ring-[#fedf36]" : ""
                    )}
                  />
                  <span className={cn(
                    "text-[10px] font-bold text-center max-w-[80px] leading-tight uppercase tracking-tighter",
                    activeCategory === cat ? "text-gray-900" : "text-gray-500"
                  )}>{cat}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Subcategories Pills */}
        {activeCategory && subCategories.length > 1 && (
          <section className="space-y-4">
            <h2 className="text-sm font-black text-[#b71700] tracking-widest uppercase">{activeCategory}</h2>
            <div className="flex flex-wrap gap-2">
              {subCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubCategory(sub)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                    activeSubCategory === sub 
                      ? "bg-[#2d3436] text-white border-[#2d3436]" 
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          </section>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#b71700] animate-spin" />
            <p className="text-gray-500 font-medium">Fetching latest listings...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item, idx) => (
              <DirectoryCard 
                key={idx} 
                item={item} 
                onShowInfo={(info) => setSelectedInfo(info)}
                onShowGallery={(item) => setGalleryItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-2">
            <p className="text-gray-400 font-medium">No listings found</p>
            <p className="text-xs text-gray-400">Try a different search term</p>
          </div>
        )}
      </main>

      {/* Categories Modal */}
      <AnimatePresence>
        {showCategoriesModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoriesModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#b71700] text-white">
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase">Explore Categories</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Find exactly what you need</p>
                </div>
                <button 
                  onClick={() => setShowCategoriesModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setActiveSubCategory('All');
                        if (onCategoryChange) onCategoryChange(cat);
                        setShowCategoriesModal(false);
                      }}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <CategoryIcon 
                        category={cat} 
                        active={activeCategory === cat}
                        className={cn(
                          "transition-all shadow-sm ring-2 ring-transparent group-hover:scale-110",
                          activeCategory === cat ? "ring-[#fedf36]" : ""
                        )}
                      />
                      <span className={cn(
                        "text-[10px] font-bold text-center leading-tight uppercase tracking-tighter",
                        activeCategory === cat ? "text-gray-900" : "text-gray-500"
                      )}>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {categories.length} Categories available in {screen}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {selectedInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInfo(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedInfo(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900">Information</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">{selectedInfo}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {galleryItem && (
          <ImageGallery 
            images={galleryItem.images} 
            onClose={() => setGalleryItem(null)} 
            title={galleryItem.name}
          />
        )}
      </AnimatePresence>

      {/* Deep Link Highlight Modal */}
      <AnimatePresence>
        {highlightedItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHighlightedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2.5rem]"
            >
              <button 
                onClick={() => setHighlightedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-full text-white transition-all shadow-xl"
              >
                <X className="w-6 h-6" />
              </button>
              <DirectoryCard 
                item={highlightedItem} 
                onShowInfo={(info) => setSelectedInfo(info)}
                onShowGallery={(item) => setGalleryItem(item)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
