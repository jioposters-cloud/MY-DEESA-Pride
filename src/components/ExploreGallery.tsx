import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Compass, Sparkles, MapPin, ExternalLink, 
  CheckCircle2, Phone, MessageCircle, Globe, Camera, X 
} from 'lucide-react';
import { fetchDirectoryData } from '../services/sheetService';
import { DirectoryItem } from '../types';
import { cn } from '../lib/utils';

interface ExploreGalleryProps {
  onBack: () => void;
}

export default function ExploreGallery({ onBack }: ExploreGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryItem, setGalleryItem] = useState<DirectoryItem | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchDirectoryData();
      const exploreItems = data.filter(item => item.images.length > 0 || item.tag).slice(0, 15);
      // Triple the items for infinite scroll effect
      setItems([...exploreItems, ...exploreItems, ...exploreItems]);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (isLoading || !containerRef.current || items.length === 0) return;

    const container = containerRef.current;
    let animationFrameId: number;
    let lastTime = 0;
    const scrollSpeed = 0.5; // Pixels per frame approx

    const scroll = (time: number) => {
      if (lastTime !== 0) {
        const delta = time - lastTime;
        container.scrollLeft += scrollSpeed * (delta / 16);

        // Infinite loop reset logic
        // We use 3 sets of items. When we reach the end of the 3rd set or start of 1st, 
        // we jump to the corresponding position in the 2nd set.
        const setWidth = container.scrollWidth / 3;
        if (container.scrollLeft >= setWidth * 2) {
          container.scrollLeft -= setWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += setWidth;
        }
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Start in the middle set of items
    // Use a small timeout to ensure layout is ready
    const timeoutId = setTimeout(() => {
      container.scrollLeft = container.scrollWidth / 3;
    }, 100);

    animationFrameId = requestAnimationFrame(scroll);

    // Pause on interaction
    const pauseScroll = () => cancelAnimationFrame(animationFrameId);
    const resumeScroll = () => {
      lastTime = 0;
      animationFrameId = requestAnimationFrame(scroll);
    };

    container.addEventListener('mouseenter', pauseScroll);
    container.addEventListener('mouseleave', resumeScroll);
    container.addEventListener('touchstart', pauseScroll);
    container.addEventListener('touchend', resumeScroll);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mouseenter', pauseScroll);
      container.removeEventListener('mouseleave', resumeScroll);
      container.removeEventListener('touchstart', pauseScroll);
      container.removeEventListener('touchend', resumeScroll);
    };
  }, [isLoading, items.length]);

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#b71700]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-black tracking-tighter text-[#b71700] uppercase">Explore Deesa</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Curated local inspiration</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#b71700]">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>
      </header>

      {/* Gallery Content */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#fcfcfc]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#b71700]/20 border-t-[#b71700] rounded-full animate-spin" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Finding gems...</p>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="w-full h-full overflow-x-auto overflow-y-hidden flex items-center px-[10vw] no-scrollbar cursor-grab active:cursor-grabbing select-none"
            style={{ scrollBehavior: 'auto' }}
          >
            <div className="flex gap-8 py-20 min-w-max items-center">
              {items.map((item, index) => (
                <ExploreCard 
                  key={`${item.name}-${index}`} 
                  item={item} 
                  containerRef={containerRef} 
                  index={index} 
                  onShowGallery={setGalleryItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Background Accents */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-yellow-50 rounded-full blur-3xl opacity-50 -z-10" />
      </div>

      {/* Footer Hint */}
      <div className="p-8 text-center bg-white border-t border-gray-50">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-[#fedf36]" />
          Swipe horizontally to discover more
          <Sparkles className="w-3 h-3 text-[#fedf36]" />
        </p>
      </div>

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

interface ExploreCardProps {
  item: DirectoryItem;
  containerRef: React.RefObject<HTMLDivElement>;
  index: number;
  onShowGallery: (item: DirectoryItem) => void;
}

const ExploreCard: React.FC<ExploreCardProps> = ({ item, containerRef, index, onShowGallery }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const updateX = () => {
      if (cardRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const cardRect = cardRef.current.getBoundingClientRect();
        const center = containerRect.left + containerRect.width / 2;
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distanceFromCenter = cardCenter - center;
        setX(distanceFromCenter / (containerRect.width / 2));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateX);
      
      // Also update on window resize or container resize
      const observer = new ResizeObserver(updateX);
      observer.observe(container);
      
      // Initial update
      updateX();

      // We can also use a custom event or just rely on the fact that 
      // the auto-scroll loop in the parent can trigger this if we pass a value.
      // But actually, scrollLeft updates trigger 'scroll' events.
      // To be extra sure on PC, we can listen for a custom event or just poll.
      const interval = setInterval(updateX, 100); // Fallback for PC auto-scroll

      return () => {
        container.removeEventListener('scroll', updateX);
        observer.disconnect();
        clearInterval(interval);
      };
    }
  }, [containerRef]);

  // Curved path logic
  // y = a * x^2 (parabola)
  const y = x * x * 100;
  const rotate = x * 15;
  const scale = 1 - Math.abs(x) * 0.15;
  const opacity = 1 - Math.abs(x) * 0.5;

  return (
    <motion.div
      ref={cardRef}
      style={{
        y,
        rotate,
        scale,
        opacity: Math.max(0.3, opacity)
      }}
      className="w-[280px] md:w-[320px] aspect-[3/4] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col snap-center group relative border border-gray-100"
    >
      <div 
        className="relative h-2/3 overflow-hidden cursor-pointer"
        onClick={() => setShowActions(!showActions)}
      >
        <img 
          src={item.images[0] || `https://picsum.photos/seed/${item.name}/600/800`} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Verified Badge */}
        {item.verified && (
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-[#00a3ff] fill-[#00a3ff] text-white" />
          </div>
        )}

        {item.tag && (
          <div className="absolute top-6 left-6 bg-[#fedf36] text-[#211b00] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            {item.tag}
          </div>
        )}

        {/* Actions Overlay */}
        <AnimatePresence>
          {showActions && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
            >
              <div className="grid grid-cols-3 gap-4">
                {item.images.length > 0 && (
                  <ActionButton 
                    icon={Camera} 
                    label="Gallery" 
                    onClick={(e) => { e.stopPropagation(); onShowGallery(item); }} 
                  />
                )}
                {item.mobile && (
                  <ActionButton 
                    icon={Phone} 
                    label="Call" 
                    onClick={(e) => { e.stopPropagation(); window.open(`tel:${item.mobile}`); }} 
                  />
                )}
                {item.whatsapp && (
                  <ActionButton 
                    icon={MessageCircle} 
                    label="WhatsApp" 
                    onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${item.whatsapp}`); }} 
                  />
                )}
                {item.website && (
                  <ActionButton 
                    icon={Globe} 
                    label="Website" 
                    onClick={(e) => { e.stopPropagation(); window.open(item.website, '_blank'); }} 
                  />
                )}
                {item.mapPin && (
                  <ActionButton 
                    icon={MapPin} 
                    label="Location" 
                    onClick={(e) => { e.stopPropagation(); window.open(item.mapPin, '_blank'); }} 
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#b71700] uppercase tracking-widest mb-1">
            <MapPin className="w-3 h-3" />
            {item.category}
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight mb-2 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {item.info || "Discover this amazing local spot in Deesa. Quality services and trusted community favorite."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Location</span>
            <span className="text-[11px] font-bold text-gray-700 truncate max-w-[120px]">{item.location || "Deesa, Gujarat"}</span>
          </div>
          <button 
            onClick={() => item.website && window.open(item.website, '_blank')}
            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-[#b71700] hover:text-white transition-all active:scale-90"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: (e: React.MouseEvent) => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group/btn"
    >
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-xl group-hover/btn:scale-110 transition-transform active:scale-90">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[8px] font-black text-white uppercase tracking-widest">{label}</span>
    </button>
  );
}
