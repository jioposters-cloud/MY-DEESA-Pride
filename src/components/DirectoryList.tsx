import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Phone, MapPin, Globe, MessageCircle, 
  CheckCircle2, Info, Loader2, Camera, X, Megaphone
} from 'lucide-react';
import { DirectoryItem, Screen } from '../types';
import { fetchDirectoryData } from '../services/sheetService';
import { cn } from '../lib/utils';
import CategoryIcon from './CategoryIcon';

interface DirectoryListProps {
  screen: Screen;
  onBack: () => void;
  initialCategory?: string | null;
}

export default function DirectoryList({ screen, onBack, initialCategory }: DirectoryListProps) {
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);
  const [galleryItem, setGalleryItem] = useState<DirectoryItem | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchDirectoryData();
      
      // Filter based on screen
      const filtered = data.filter(item => {
        const cat = item.category.toLowerCase();
        if (screen === 'phonebook') return true; // Show all for phonebook but we will categorize it
        if (screen === 'rental') return cat.includes('rental');
        if (screen === 'property') return cat.includes('property');
        if (screen === 'jobs') return cat.includes('job');
        if (screen === 'food') return cat.includes('food') || cat.includes('restaurant');
        if (screen === 'realestate') return cat.includes('real estate schemes');
        return true;
      });
      
      setItems(filtered);
      setLoading(false);
    }
    loadData();
  }, [screen]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(item => item.category)));
    return cats.sort();
  }, [items]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All');
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      if (initialCategory && categories.includes(initialCategory)) {
        setActiveCategory(initialCategory);
      } else if (!activeCategory) {
        setActiveCategory(categories[0]);
      }
    }
  }, [categories, activeCategory, initialCategory]);

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
            <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveSubCategory('All');
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
    </div>
  );
}

const ImageGallery: React.FC<{ images: string[], onClose: () => void, title: string }> = ({ images, onClose, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white z-10">
          <div className="flex flex-col">
            <h3 className="font-black text-lg uppercase tracking-tight">{title}</h3>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Image {currentIndex + 1} of {images.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Image Area */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-sm"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-sm"
              >
                <motion.div style={{ rotate: 180 }}>
                  <ArrowLeft className="w-6 h-6" />
                </motion.div>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="p-6 flex justify-center gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                  currentIndex === idx ? "border-[#fedf36] scale-110" : "border-transparent opacity-40"
                )}
              >
                <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const DirectoryCard: React.FC<{ item: DirectoryItem, onShowInfo: (info: string) => void, onShowGallery: (item: DirectoryItem) => void }> = ({ item, onShowInfo, onShowGallery }) => {
  const hasImage = item.images.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm ring-1 ring-black/5 flex flex-col h-full"
    >
      {/* Image Header */}
      {hasImage && (
        <div 
          onClick={() => onShowGallery(item)}
          className="relative h-56 w-full group border-b-4 border-[#fedf36] cursor-pointer"
        >
          <img 
            src={item.images[0]} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-3 h-3" />
            View Gallery ({item.images.length})
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 space-y-4">
        {/* Title & Badges */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black tracking-tight text-gray-900 uppercase">{item.name}</h3>
            {item.verified && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#00a3ff] bg-white shadow-sm">
                <CheckCircle2 className="w-4 h-4 fill-[#00a3ff] text-white" />
                <span className="text-[11px] font-black text-[#00a3ff] tracking-tight">VERIFIED</span>
              </div>
            )}
            {item.info && (
              <button 
                onClick={() => onShowInfo(item.info)}
                className="text-gray-400 hover:text-[#00a3ff] transition-colors"
              >
                <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
                  <span className="text-[10px] font-serif italic font-black leading-none">i</span>
                </div>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="bg-[#fedf36] text-[#211b00] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {item.category}
            </span>
          </div>

          {item.info && (item.verified ? (
            <div className="bg-[#fedf36] rounded-lg py-1.5 px-3 overflow-hidden relative shadow-sm">
              <div className="flex items-center gap-8 whitespace-nowrap animate-marquee w-max min-w-full">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#b71700] fill-[#b71700] flex-shrink-0" />
                  <span className="text-[11px] font-bold text-[#211b00] uppercase tracking-tight">{item.info}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#b71700] fill-[#b71700] flex-shrink-0" />
                  <span className="text-[11px] font-bold text-[#211b00] uppercase tracking-tight">{item.info}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#fedf36] rounded-lg p-2 flex items-center gap-2 shadow-sm">
              <Megaphone className="w-4 h-4 text-[#b71700] fill-[#b71700]" />
              <span className="text-[11px] font-bold text-[#211b00] uppercase truncate">{item.tag || item.info}</span>
            </div>
          )) || item.tag && (
            <div className="bg-[#fedf36] rounded-lg p-2 flex items-center gap-2 shadow-sm">
              <Megaphone className="w-4 h-4 text-[#b71700] fill-[#b71700]" />
              <span className="text-[11px] font-bold text-[#211b00] uppercase truncate">{item.tag}</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm pt-2 border-t border-gray-50">
          <div className="flex gap-2">
            <span className="font-bold text-gray-400 min-w-[60px]">Service:</span>
            <span className="text-gray-600 font-medium">{item.subCategory}</span>
          </div>
          {item.location && (
            <div className="flex gap-2">
              <span className="font-bold text-gray-400 min-w-[60px]">Loc:</span>
              <div className="flex-1 flex items-start justify-between gap-2">
                <span className="text-gray-600 font-medium leading-snug">{item.location}</span>
                {item.mapPin && (
                  <a href={item.mapPin} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:scale-110 transition-transform flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2 mt-auto">
          <div className="grid grid-cols-2 gap-2">
            {item.mobile && (
              <a 
                href={`tel:${item.mobile}`} 
                className="flex items-center justify-center gap-2 py-3 bg-[#ff4422] text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-500/10"
              >
                <Phone className="w-4 h-4 fill-white" />
                Call
              </a>
            )}
            {item.whatsapp && (
              <a 
                href={`https://wa.me/${item.whatsapp}`} 
                className="flex items-center justify-center gap-2 py-3 bg-[#25d366] text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-green-500/10"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                WhatsApp
              </a>
            )}
          </div>
          {item.website && (
            <a 
              href={item.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 py-3 bg-[#222222] text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              <Globe className="w-4 h-4" />
              Website
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
