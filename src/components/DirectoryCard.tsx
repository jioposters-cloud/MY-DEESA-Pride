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
  onShowInfo: (info: string) => void;
  onShowGallery: (item: DirectoryItem) => void;
}

export const DirectoryCard: React.FC<DirectoryCardProps> = ({ item, onShowInfo, onShowGallery }) => {
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
          <div className="flex items-center justify-between gap-2">
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
            
            <button 
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-[#b71700] hover:bg-red-50 rounded-full transition-all active:scale-90"
            >
              <Share2 className="w-5 h-5" />
            </button>
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
