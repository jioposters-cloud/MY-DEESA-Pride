import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Phone, MapPin, Globe, MessageCircle, 
  CheckCircle2, Info, Loader2, Camera, X, Megaphone, Share2,
  Moon, Sun, Sparkles, User
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
  forceDarkMode?: boolean;
}

const DarkCSSTricksCard: React.FC<{ 
  item: DirectoryItem, 
  idx: number, 
  onShowInfo: (i: string) => void,
  onShowGallery: (item: DirectoryItem) => void 
}> = ({ item, idx, onShowInfo, onShowGallery }) => {
  const colors = ["#ff2d12", "#fedf36", "#00a3ff", "#25d366", "#d63384"];
  const color = colors[idx % colors.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (idx % 10) * 0.05 }}
      className="bg-[#222222] min-w-[280px] w-[85vw] max-w-[340px] rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border border-white/5 group active:scale-[0.98] transition-all duration-300 relative snap-center flex flex-col h-[500px] mb-8"
    >
      <div 
        className="h-2 w-full shrink-0" 
        style={{ backgroundColor: color }}
      />
      
      <div className="p-7 flex flex-col h-full space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-4 flex-1">
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-white font-mono">Profile</span>
                <div className="flex items-center gap-2">
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Updated</span>
                  {item.verified && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30">
                      <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400/20" />
                      <span className="text-[8px] font-black text-blue-400 tracking-tighter">VERIFIED</span>
                    </div>
                  )}
                </div>
             </div>
             <h3 className="text-2xl font-black text-white tracking-tighter leading-tight group-hover:text-red-400 transition-colors uppercase font-sans line-clamp-3">
               {item.name}
             </h3>
          </div>
          {item.images.length > 0 ? (
             <button 
                onClick={() => onShowGallery(item)}
                className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/10 shadow-2xl transition-all hover:scale-110 hover:-rotate-3 relative"
             >
                <img src={item.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt={item.name} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
             </button>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-gray-700" />
            </div>
          )}
        </div>

        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] font-mono" style={{ color }}>{item.category}</span>
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">Sub: {item.subCategory}</span>
            </div>
            <p className="text-[13px] text-gray-400 leading-relaxed font-medium tracking-tight line-clamp-4 italic border-l-2 border-white/5 pl-4">
              " {item.info || item.tag || item.location || "Local service provider dedicated to quality and excellence in Deesa. Contact for more details."} "
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/5">
           <div className="flex gap-3">
             <a 
              href={`tel:${item.mobile}`} 
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1a1a1a] hover:bg-white/5 rounded-xl text-white text-[11px] font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95 shadow-lg"
             >
               <Phone className="w-3.5 h-3.5 text-blue-400" />
               Call
             </a>
             <a 
              href={`https://wa.me/${item.whatsapp}`} 
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1a1a1a] hover:bg-white/5 rounded-xl text-green-400 text-[11px] font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95 shadow-lg"
             >
               <MessageCircle className="w-3.5 h-3.5" />
               Chat
             </a>
           </div>

           {item.website && (
             <a 
              href={item.website} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all active:scale-95"
             >
               <Globe className="w-3.5 h-3.5 text-purple-400" />
               Visit Website
             </a>
           )}
           {item.images.length > 1 && (
             <button 
               onClick={() => onShowGallery(item)}
               className="w-full py-2 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] hover:text-white transition-colors"
             >
               View All {item.images.length} Photos
             </button>
           )}
        </div>
      </div>
    </motion.div>
  );
};

export default function DirectoryList({ screen, onBack, initialCategory, onCategoryChange, forceDarkMode = false }: DirectoryListProps) {
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);
  const [galleryItem, setGalleryItem] = useState<DirectoryItem | null>(null);
  const [highlightedItem, setHighlightedItem] = useState<DirectoryItem | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(forceDarkMode);

  useEffect(() => {
    setIsDarkMode(forceDarkMode);
  }, [forceDarkMode]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchDirectoryData();
      
      // Check for deep link (Clean up URL search params more safely)
      const params = new URLSearchParams(window.location.search);
      const itemName = params.get('item');
      if (itemName) {
        const item = data.find(i => i.name === itemName);
        if (item) {
          setHighlightedItem(item);
          // Gently clear the URL without a full reload
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState(window.history.state, '', newUrl);
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
        if (screen === 'new-to-try') return cat.includes('new to try in deesa');
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

  // Auto-scroll categories (Optimized for mobile)
  useEffect(() => {
    const el = categoriesRef.current;
    if (!el || isPaused || categories.length <= 1) return;

    let frameId: number;
    let lastTime = 0;
    
    const scroll = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      
      // Only update every 30ms (~30fps) instead of 60fps to save battery/memory on mobile
      if (delta > 32) {
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += 0.5;
        }
        lastTime = time;
      }
      frameId = requestAnimationFrame(scroll);
    };

    const timeoutId = setTimeout(() => {
      frameId = requestAnimationFrame(scroll);
    }, 3000); // Start after 3s to allow initial load to settle

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

  const title = forceDarkMode ? 'Dark Phonebook' :
                screen === 'phonebook' ? 'Phonebook - MyDeesa App Diary' : 
                screen === 'realestate' ? 'Real Estate Schemes' :
                screen === 'events' ? 'Events of Deesa' :
                screen === 'new-to-try' ? 'New to Try in DEESA' :
                screen.charAt(0).toUpperCase() + screen.slice(1);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 pb-10",
      isDarkMode ? "bg-[#0a0a0a]" : "bg-[#fdfbf7]"
    )}>
      {/* Header */}
      <header className={cn(
        "fixed top-0 w-full z-50 transition-colors duration-500 backdrop-blur-xl border-b",
        isDarkMode ? "bg-[#0a0a0a]/90 border-white/10 shadow-lg shadow-black/50" : "bg-white/90 border-gray-100 shadow-sm"
      )}>
        <div className="flex items-center px-4 h-16 max-w-5xl mx-auto gap-4">
          <button 
            onClick={onBack} 
            className={cn(
              "p-2 rounded-lg transition-colors",
              isDarkMode ? "text-white hover:bg-white/10" : "text-[#b71700] hover:bg-gray-100"
            )}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className={cn(
            "text-xl font-black tracking-tighter flex-1 uppercase",
            isDarkMode ? "text-white" : "text-[#b71700]"
          )}>{title}</h1>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "p-2 rounded-full transition-all active:scale-95 shadow-sm border",
              isDarkMode ? "bg-white/10 border-white/10 text-yellow-400" : "bg-white border-gray-200 text-gray-500"
            )}
          >
            {isDarkMode ? <Sun className="w-5 h-5 fill-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-5xl mx-auto space-y-6">
        {/* Search */}
        <div className={cn(
          "rounded-full shadow-sm flex items-center px-5 py-4 gap-3 ring-1 transition-all duration-500",
          isDarkMode 
            ? "bg-[#1a1a1a] ring-white/10 focus-within:ring-red-500/50" 
            : "bg-white ring-black/5 focus-within:ring-[#b71700]/10"
        )}>
          <Search className={cn("w-5 h-5", isDarkMode ? "text-gray-600" : "text-gray-400")} />
          <input 
            className={cn(
              "w-full bg-transparent border-none focus:ring-0 text-sm font-medium",
              isDarkMode ? "text-white placeholder-gray-600" : "text-gray-900 placeholder-gray-400"
            )} 
            placeholder={`Search in ${screen}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Horizontal Scroll */}
        {categories.length > 1 && (
          <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className={cn(
                "text-sm font-black tracking-widest uppercase transition-colors",
                isDarkMode ? "text-red-500" : "text-[#b71700]"
              )}>Explore Categories</h2>
              <button 
                onClick={() => setShowCategoriesModal(true)}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest hover:underline",
                  isDarkMode ? "text-red-400" : "text-red-500"
                )}
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
                  <div className="relative">
                    <CategoryIcon 
                      category={cat} 
                      active={activeCategory === cat}
                      className={cn(
                        "transition-all shadow-sm ring-2 ring-transparent",
                        activeCategory === cat ? (isDarkMode ? "ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "ring-[#fedf36]") : ""
                      )}
                    />
                    {isDarkMode && activeCategory === cat && (
                      <motion.div 
                        layoutId="activeCategoryGlow"
                        className="absolute inset-0 bg-red-500/20 blur-xl -z-10 rounded-full" 
                      />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold text-center max-w-[80px] leading-tight uppercase tracking-tighter transition-colors",
                    activeCategory === cat 
                      ? (isDarkMode ? "text-white" : "text-gray-900") 
                      : (isDarkMode ? "text-gray-400" : "text-gray-500")
                  )}>{cat}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Subcategories Pills */}
        {activeCategory && subCategories.length > 1 && (
          <section className="space-y-4">
            <h2 className={cn(
              "text-sm font-black tracking-widest uppercase px-1 transition-colors",
              isDarkMode ? "text-red-500" : "text-[#b71700]"
            )}>{activeCategory}</h2>
            <div className="flex flex-wrap gap-2 px-1">
              {subCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubCategory(sub)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                    activeSubCategory === sub 
                      ? (isDarkMode ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" : "bg-[#2d3436] text-white border-[#2d3436]")
                      : (isDarkMode ? "bg-[#1a1a1a] text-gray-300 border-white/5 hover:border-white/20" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300")
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
            <Loader2 className={cn("w-10 h-10 animate-spin", isDarkMode ? "text-red-500" : "text-[#b71700]")} />
            <p className={cn("font-medium", isDarkMode ? "text-gray-600" : "text-gray-500")}>Fetching latest listings...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          isDarkMode ? (
            <div className="space-y-12">
               <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-red-500" />
                  <h2 className="text-xl font-black text-white tracking-tighter uppercase font-sans">Latest Collections</h2>
                </div>
                <div className="flex overflow-x-auto gap-6 pb-12 px-4 -mx-4 hide-scrollbar snap-x snap-mandatory">
                   {filteredItems.map((item, idx) => (
                      <DarkCSSTricksCard 
                        key={idx}
                        item={item}
                        idx={idx}
                        onShowInfo={(info) => setSelectedInfo(info)}
                        onShowGallery={(item) => setGalleryItem(item)}
                      />
                   ))}
                </div>
               </section>
            </div>
          ) : (
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
          )
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
              className={cn(
                "relative w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh] border transition-colors duration-500",
                isDarkMode ? "bg-[#121212] border-white/10" : "bg-white border-gray-100"
              )}
            >
              <div className={cn(
                "p-6 border-b flex justify-between items-center transition-colors duration-500",
                isDarkMode ? "bg-[#1a1a1a] border-white/10 text-white" : "bg-[#b71700] text-white border-transparent"
              )}>
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
                      <div className="relative">
                        <CategoryIcon 
                          category={cat} 
                          active={activeCategory === cat}
                          className={cn(
                            "transition-all shadow-sm ring-2 ring-transparent group-hover:scale-110",
                            activeCategory === cat ? (isDarkMode ? "ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "ring-[#fedf36]") : ""
                          )}
                        />
                        {isDarkMode && activeCategory === cat && (
                          <motion.div 
                            layoutId="activeCategoryModalGlow"
                            className="absolute inset-0 bg-red-500/20 blur-xl -z-10 rounded-full" 
                          />
                        )}
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold text-center leading-tight uppercase tracking-tighter transition-colors",
                        activeCategory === cat 
                          ? (isDarkMode ? "text-white" : "text-gray-900") 
                          : (isDarkMode ? "text-gray-500" : "text-gray-500")
                      )}>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={cn(
                "p-6 border-t text-center transition-colors duration-500",
                isDarkMode ? "bg-[#0a0a0a] border-white/10" : "bg-gray-50 border-gray-100"
              )}>
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
              className={cn(
                "relative w-full max-w-sm rounded-3xl p-6 shadow-2xl border transition-colors duration-500",
                isDarkMode ? "bg-[#121212] border-white/10" : "bg-white border-transparent"
              )}
            >
              <button 
                onClick={() => setSelectedInfo(null)}
                className={cn(
                  "absolute top-4 right-4 p-2 rounded-full transition-colors",
                  isDarkMode ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-400"
                )}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isDarkMode ? "bg-blue-500/10" : "bg-blue-50"
                )}>
                  <Info className={cn("w-5 h-5", isDarkMode ? "text-blue-400" : "text-blue-600")} />
                </div>
                <h4 className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Information</h4>
              </div>
              <p className={cn(
                "leading-relaxed transition-colors",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>{selectedInfo}</p>
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
              onClick={() => {
                setHighlightedItem(null);
                window.history.replaceState({}, '', window.location.pathname);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2.5rem]"
            >
              <button 
                onClick={() => {
                  setHighlightedItem(null);
                  window.history.replaceState({}, '', window.location.pathname);
                }}
                className="absolute top-6 right-6 z-20 p-2 bg-[#b71700] hover:bg-red-700 rounded-full text-white transition-all shadow-xl active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
              <DirectoryCard 
                item={highlightedItem} 
                isDarkMode={isDarkMode}
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
