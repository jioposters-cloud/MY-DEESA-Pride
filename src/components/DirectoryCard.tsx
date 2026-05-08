import React from 'react';
import { motion } from 'motion/react';
import { 
  Phone, MapPin, Globe, MessageCircle, 
  CheckCircle2, Camera, Megaphone, Share2
} from 'lucide-react';
import { DirectoryItem } from '../types';
import { cn } from '../lib/utils';

interface DirectoryCardProps {
  item: DirectoryItem;
  isDarkMode?: boolean;
  onShowInfo: (info: string) => void;
  onShowGallery: (item: DirectoryItem) => void;
}

export const DirectoryCard: React.FC<DirectoryCardProps> = ({ item, isDarkMode, onShowInfo, onShowGallery }) => {
  const hasImage = item.images.length > 0;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?item=${encodeURIComponent(item.name)}`;
    const shareText = `Check out ${item.name} on MyDeesa App!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert("Link copied to clipboard!");
      } catch (err) {
        alert("Failed to copy link.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-500",
        isDarkMode 
          ? "bg-[#121212] ring-1 ring-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
          : "bg-white shadow-sm ring-1 ring-black/5"
      )}
    >
      {/* Image Header */}
      {hasImage && (
        <div 
          onClick={() => onShowGallery(item)}
          className={cn(
            "relative h-56 w-full group cursor-pointer overflow-hidden",
            isDarkMode ? "border-b border-white/10" : "border-b-4 border-[#fedf36]"
          )}
        >
          <img 
            src={item.images[0]} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          {isDarkMode && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />
          )}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border border-white/10">
            <Camera className="w-3 h-3" />
            Gallery ({item.images.length})
          </div>
        </div>
      )}

      {/* Dynamic Border Accent for Dark Mode */}
      {isDarkMode && !hasImage && (
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
      )}

      <div className="p-5 flex flex-col flex-1 space-y-4">
        {/* Title & Badges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={cn(
                "text-lg font-black tracking-tight uppercase",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>{item.name}</h3>
              {item.verified && (
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded border shadow-sm",
                  isDarkMode 
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-400" 
                    : "border-[#00a3ff] bg-white text-[#00a3ff]"
                )}>
                  <CheckCircle2 className={cn("w-4 h-4", isDarkMode ? "fill-blue-400 text-[#121212]" : "fill-[#00a3ff] text-white")} />
                  <span className="text-[11px] font-black tracking-tight">VERIFIED</span>
                </div>
              )}
              {item.info && (
                <button 
                  onClick={() => onShowInfo(item.info!)}
                  className={cn(
                    "transition-colors rounded-full p-0.5",
                    isDarkMode ? "text-blue-400 hover:bg-blue-400/10" : "text-gray-400 hover:text-[#00a3ff]"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center",
                    isDarkMode ? "border-blue-400/50" : "border-gray-400"
                  )}>
                    <span className="text-[9px] font-serif italic font-black leading-none">i</span>
                  </div>
                </button>
              )}
            </div>
            
            <button 
              onClick={handleShare}
              className={cn(
                "p-2 rounded-full transition-all active:scale-90",
                isDarkMode 
                  ? "text-gray-400 hover:text-white hover:bg-white/10" 
                  : "text-gray-400 hover:text-[#b71700] hover:bg-red-50"
              )}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={cn(
              "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
              isDarkMode 
                ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/20" 
                : "bg-[#fedf36] text-[#211b00]"
            )}>
              {item.category}
            </span>
          </div>

          {item.info && (item.verified ? (
            <div className={cn(
              "rounded-lg py-1.5 px-3 overflow-hidden relative shadow-sm",
              isDarkMode ? "bg-red-500/10 border border-red-500/20" : "bg-[#fedf36]"
            )}>
              <div className="flex items-center gap-8 whitespace-nowrap animate-marquee w-max min-w-full">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Megaphone className={cn("w-4 h-4 flex-shrink-0", isDarkMode ? "text-red-400" : "text-[#b71700] fill-[#b71700]")} />
                    <span className={cn(
                      "text-[11px] font-bold uppercase tracking-tight",
                      isDarkMode ? "text-red-400" : "text-[#211b00]"
                    )}>{item.info}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={cn(
              "rounded-lg p-2 flex items-center gap-2 shadow-sm",
              isDarkMode ? "bg-white/5 border border-white/10" : "bg-[#fedf36]"
            )}>
              <Megaphone className={cn("w-4 h-4", isDarkMode ? "text-gray-400" : "text-[#b71700] fill-[#b71700]")} />
              <span className={cn(
                "text-[11px] font-bold truncate",
                isDarkMode ? "text-gray-400" : "text-[#211b00]"
              )}>{item.tag || item.info}</span>
            </div>
          )) || item.tag && (
            <div className={cn(
              "rounded-lg p-2 flex items-center gap-2 shadow-sm",
              isDarkMode ? "bg-white/5 border border-white/10" : "bg-[#fedf36]"
            )}>
              <Megaphone className={cn("w-4 h-4", isDarkMode ? "text-gray-400" : "text-[#b71700] fill-[#b71700]")} />
              <span className={cn(
                "text-[11px] font-bold truncate",
                isDarkMode ? "text-gray-400" : "text-[#211b00]"
              )}>{item.tag}</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className={cn(
          "space-y-2 text-sm pt-4 border-t transition-colors",
          isDarkMode ? "border-white/5" : "border-gray-50"
        )}>
          <div className="flex gap-2">
            <span className={cn("font-bold min-w-[60px]", isDarkMode ? "text-gray-400" : "text-gray-400")}>Service:</span>
            <span className={cn("font-medium", isDarkMode ? "text-gray-300" : "text-gray-600")}>{item.subCategory}</span>
          </div>
          {item.location && (
            <div className="flex gap-2">
              <span className={cn("font-bold min-w-[60px]", isDarkMode ? "text-gray-400" : "text-gray-400")}>Loc:</span>
              <div className="flex-1 flex items-start justify-between gap-2">
                <span className={cn("font-medium leading-snug", isDarkMode ? "text-gray-400" : "text-gray-600")}>{item.location}</span>
                {item.mapPin && (
                  <a href={item.mapPin} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:scale-110 transition-transform flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Improved Action Buttons */}
        <div className="pt-2 space-y-2 mt-auto">
          <div className="grid grid-cols-2 gap-2">
            {item.mobile && (
              <a 
                href={`tel:${item.mobile}`} 
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                  isDarkMode 
                    ? "bg-[#ff4422]/10 border border-[#ff4422]/30 text-[#ff4422] shadow-red-500/5 hover:bg-[#ff4422]/20" 
                    : "bg-[#ff4422] text-white shadow-red-500/10"
                )}
              >
                <Phone className={cn("w-4 h-4", isDarkMode ? "text-[#ff4422]" : "fill-white")} />
                Call
              </a>
            )}
            {item.whatsapp && (
              <a 
                href={`https://wa.me/${item.whatsapp}`} 
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                  isDarkMode 
                    ? "bg-green-500/10 border border-green-500/30 text-green-400 shadow-green-500/5 hover:bg-green-500/20" 
                    : "bg-[#25d366] text-white shadow-green-500/10"
                )}
              >
                <MessageCircle className={cn("w-4 h-4", isDarkMode ? "text-green-400" : "fill-white")} />
                WhatsApp
              </a>
            )}
          </div>
          {item.website && (
            <a 
              href={item.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                isDarkMode 
                  ? "bg-white/5 border border-white/10 text-white hover:bg-white/10" 
                  : "bg-[#222222] text-white shadow-black/10"
              )}
            >
              <Globe className="w-4 h-4 text-white" />
              Website
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
