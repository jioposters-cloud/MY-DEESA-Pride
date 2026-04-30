import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Menu, SlidersHorizontal, Contact, Key, Building2, 
  Briefcase, Utensils, Compass, Cloud, Tractor, 
  ShoppingBag, Home, LayoutGrid, User, Plus, X, Globe, Phone, Mail, Waypoints, Calendar,
  Gamepad2, Bell
} from 'lucide-react';
import { DirectoryItem, Screen } from '../types';
import { fetchDirectoryData } from '../services/sheetService';
import { fetchLatestApmcRates } from '../services/geminiService';
import { cn } from '../lib/utils';
import AIChat from './AIChat';
import CategoryIcon from './CategoryIcon';

const BridgeIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 10h20M2 13h20" />
    <path d="M7 13v6" strokeWidth="3" />
    <path d="M17 13v6" strokeWidth="3" />
    <path d="M2 7h20" strokeWidth="1" />
    <path d="M5 7v3M12 7v3M19 7v3" strokeWidth="1" />
  </svg>
);

interface DashboardProps {
  onNavigate: (screen: Screen, category?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [featuredItems, setFeaturedItems] = useState<DirectoryItem[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'APMC Status', message: 'New market rates for Potato are updated.', time: '2 mins ago' },
    { id: 2, title: 'Weather Alert', message: 'Clear skies expected in Deesa today.', time: '1 hour ago' },
    { id: 3, title: 'New Event', message: 'Summer Cricket Tournament entries open.', time: '3 hours ago' },
    { id: 4, title: 'Business Update', message: '5 new rentals added in Deesa vicinity.', time: '5 hours ago' },
    { id: 5, title: 'App Update', message: 'Game zone is now live in MyDeesa!', time: 'Yesterday' },
  ]);
  const [tickerData, setTickerData] = useState<string>("APMC Deesa: Loading latest rates... • Stay tuned • Refresh for updates.");

  useEffect(() => {
    async function loadData() {
      const data = await fetchDirectoryData();
      const featured = data.filter(item => item.category === 'Featured Spotlights');
      setFeaturedItems(featured);
      
      const cats = Array.from(new Set(data.map(item => item.category))).sort();
      setAllCategories(cats);
    }
    
    async function loadTicker() {
      try {
        const rates = await fetchLatestApmcRates();
        setTickerData(rates);
      } catch (err) {
        console.error("Failed to load ticker:", err);
      }
    }

    loadData();
    loadTicker();
  }, []);

  const categories = [
    { id: 'phonebook', name: 'Phonebook', icon: Contact, color: 'bg-red-50 text-[#b71700]', screen: 'phonebook' },
    { id: 'rental', name: 'Rental', icon: Key, color: 'bg-yellow-50 text-[#6d5e00]', screen: 'rental' },
    { id: 'property', name: 'Property', icon: Building2, color: 'bg-blue-50 text-blue-700', screen: 'property' },
    { id: 'realestate', name: 'Real Estate Schemes', icon: Home, color: 'bg-indigo-50 text-indigo-700', screen: 'realestate' },
    { id: 'jobs', name: 'Job Vacancies', icon: Briefcase, color: 'bg-green-50 text-emerald-700', screen: 'jobs' },
    { id: 'food', name: 'Food', icon: Utensils, color: 'bg-orange-50 text-orange-700', screen: 'food' },
    { id: 'explore', name: 'Explore City', icon: Compass, color: 'bg-purple-50 text-purple-700', screen: 'explore' },
    { id: 'weather', name: 'Weather', icon: Cloud, color: 'bg-sky-50 text-sky-700', screen: 'weather' },
    { id: 'apmc', name: 'APMC', icon: Tractor, color: 'bg-amber-50 text-amber-700', screen: 'apmc' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-rose-50 text-rose-700', screen: 'shopping' },
    { id: 'bridge', name: 'Deesa Bridge Corridor', icon: BridgeIcon, color: 'bg-cyan-50 text-cyan-700', url: 'https://mydeesa-sdg.jioposters.workers.dev/' },
    { id: 'events', name: 'Events', icon: Calendar, color: 'bg-pink-50 text-pink-700', screen: 'events' },
    { id: 'game', name: 'Games', icon: Gamepad2, color: 'bg-violet-50 text-violet-700', screen: 'game' },
  ];

  const handleCategoryClick = (cat: any) => {
    if (cat.url) {
      window.open(cat.url, '_blank');
    } else {
      onNavigate(cat.screen as Screen);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] pb-28">
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Notification Modal */}
      <AnimatePresence>
        {isNotificationOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#b71700] text-white">
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase">Notifications</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Stay Updated</p>
                </div>
                <button 
                  onClick={() => setIsNotificationOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-red-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-black text-[#b71700] uppercase tracking-tight">{notif.title}</h4>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-snug">{notif.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 text-center">
                <button className="text-[10px] font-bold text-[#b71700] uppercase tracking-widest hover:underline">
                  Clear All Notifications
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#b71700] text-white">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase">Explore Categories</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Browse by business type</p>
                </div>
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-3 gap-6">
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onNavigate('phonebook', cat);
                        setIsCategoryModalOpen(false);
                        setIsSidebarOpen(false);
                      }}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <CategoryIcon 
                        category={cat} 
                        className="group-hover:scale-110 group-active:scale-95"
                      />
                      <span className="text-[10px] font-bold text-center text-gray-600 uppercase tracking-tighter leading-tight group-hover:text-gray-900">
                        {cat}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#b71700] text-white">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter">MyDeesa</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Digital Concierge</p>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                <SidebarItem 
                  icon={Globe} 
                  label="Explore MyDeesa" 
                  onClick={() => { onNavigate('explore'); setIsSidebarOpen(false); }}
                  active
                />
                <SidebarItem 
                  icon={LayoutGrid} 
                  label="Explore Categories" 
                  onClick={() => { setIsCategoryModalOpen(true); }}
                />
                <SidebarItem 
                  icon={LayoutGrid} 
                  label="All Services" 
                  onClick={() => { onNavigate('dashboard'); setIsSidebarOpen(false); }}
                />
                <SidebarItem 
                  icon={Briefcase} 
                  label="Job Vacancies" 
                  onClick={() => { onNavigate('jobs'); setIsSidebarOpen(false); }}
                />
                <SidebarItem 
                  icon={Home} 
                  label="Real Estate" 
                  onClick={() => { onNavigate('realestate'); setIsSidebarOpen(false); }}
                />
                <SidebarItem 
                  icon={Calendar} 
                  label="Events" 
                  onClick={() => { onNavigate('events'); setIsSidebarOpen(false); }}
                />
                <SidebarItem 
                  icon={Gamepad2} 
                  label="Games" 
                  onClick={() => { onNavigate('game'); setIsSidebarOpen(false); }}
                />
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Support & Info</p>
                  <SidebarItem icon={Phone} label="Contact Us" onClick={() => window.open('tel:+919924510101', '_self')} />
                  <SidebarItem icon={Mail} label="Email Support" onClick={() => window.open('mailto:deesanew@gmail.com', '_self')} />
                  <p className="px-4 mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
                    Data is managed by Team MY DEESA
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                  Brought to you by Dr.Ankit M.Patel | Imax Dental , Deesa
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAB Menu Overlay */}
      <AnimatePresence>
        {isFabOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFabOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[45]"
            />
            <div className="fixed bottom-40 right-6 z-50 flex flex-col items-end gap-4">
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                onClick={() => {
                  window.open('https://forms.gle/qq23MUr12Gn3kqPAA', '_blank');
                  setIsFabOpen(false);
                }}
                className="bg-white text-[#b71700] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 group"
              >
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black uppercase tracking-tight">Add Business Details</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">તમારો ધંધો,સેવાઓ ઉમેરો</span>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: 0.05 }}
                onClick={() => {
                  setIsChatOpen(true);
                  setIsFabOpen(false);
                }}
                className="bg-white text-[#b71700] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 group"
              >
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black uppercase tracking-tight">AI Help Assistant</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Find related information</span>
                </div>
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5" />
                </div>
              </motion.button>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center px-6 h-16 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-[#b71700] p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black tracking-tighter text-[#b71700]">MyDeesa</h1>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="text-[#b71700] p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 border-2 border-white rounded-full"></span>
            </button>
            <button className="text-[#b71700] p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-5xl mx-auto space-y-8">
        {/* Marquee News */}
        <section className="overflow-hidden bg-[#df2d12] text-white rounded-xl py-3 px-4 flex items-center">
          <span className="flex-shrink-0 bg-[#fedf36] text-[#211b00] text-[10px] font-bold px-2 py-1 rounded mr-3 uppercase tracking-wider">
            Today in Deesa
          </span>
          <div className="whitespace-nowrap overflow-hidden">
            <motion.p 
              animate={{ x: [0, -2000] }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              className="text-sm font-medium"
            >
              {tickerData}
            </motion.p>
          </div>
        </section>

        {/* Search Bar */}
        <section className="relative">
          <div className="bg-white rounded-full shadow-sm flex items-center px-5 py-4 gap-3 ring-1 ring-black/5 focus-within:ring-[#b71700]/30 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400" 
              placeholder="Search for services, shops..." 
              type="text"
            />
            <button className="bg-[#b71700] text-white p-2 rounded-full active:scale-90 transition-transform">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Service Grid */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-black text-[#b71700] tracking-widest uppercase">Quick Services</h2>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline"
            >
              View All &gt;
            </button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-6 gap-x-4">
            {categories.map((cat) => {
              const content = (
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-3 group relative cursor-pointer"
                >
                  <div className="relative">
                    {cat.id === 'phonebook' && (
                      <>
                        <div className="absolute inset-0 bg-[#b71700]/20 rounded-full animate-pulse-wave" />
                        <div className="absolute inset-0 bg-[#b71700]/10 rounded-full animate-pulse-wave [animation-delay:0.5s]" />
                      </>
                    )}
                    <div className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center transition-all group-hover:brightness-95 shadow-sm relative z-10",
                      cat.color
                    )}>
                      <cat.icon className="w-12 h-12" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-center text-gray-600 uppercase tracking-tight leading-tight">{cat.name}</span>
                </motion.div>
              );

              if (cat.url) {
                return (
                  <a 
                    key={cat.id} 
                    href={cat.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block shadow-none hover:shadow-none"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="block"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured Spotlights */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#b71700] rounded-full"></span>
            Featured Spotlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredItems.length > 0 ? (
              featuredItems.map((item, idx) => (
                <FeaturedCard 
                  key={idx}
                  title={item.name} 
                  subtitle={item.info} 
                  tag={item.tag} 
                  image={item.images[0] || "https://picsum.photos/seed/featured/800/600"}
                  tagColor={idx % 2 === 0 ? "bg-[#fedf36] text-[#211b00]" : "bg-[#b71700] text-white"}
                  url={item.website}
                />
              ))
            ) : (
              <>
                <FeaturedCard 
                  title="Hotel Royal Deesa" 
                  subtitle="Best luxury stay experience" 
                  tag="HOT DEAL" 
                  image="https://picsum.photos/seed/hotel/800/600"
                  tagColor="bg-[#fedf36] text-[#211b00]"
                />
                <FeaturedCard 
                  title="Central Market Food Court" 
                  subtitle="Explore local delicacies" 
                  tag="NEW ENTRY" 
                  image="https://picsum.photos/seed/market/800/600"
                  tagColor="bg-[#b71700] text-white"
                />
              </>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full rounded-t-2xl z-50 bg-white/90 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)] h-20 px-4 flex justify-around items-center">
        <NavItem icon={Home} label="Home" active onClick={() => onNavigate('dashboard')} />
        <NavItem icon={LayoutGrid} label="Services" onClick={() => setIsCategoryModalOpen(true)} />
        <NavItem icon={Compass} label="Explore" showWave onClick={() => onNavigate('explore')} />
        <NavItem icon={Briefcase} label="Jobs" onClick={() => onNavigate('jobs')} />
        <NavItem icon={ShoppingBag} label="Shopping" onClick={() => onNavigate('shopping')} />
      </nav>

      {/* FAB */}
      <button 
        onClick={() => setIsFabOpen(!isFabOpen)}
        className={cn(
          "fixed bottom-24 right-6 w-14 h-14 bg-[#fedf36] text-[#211b00] rounded-full shadow-2xl flex items-center justify-center transition-all z-[55]",
          isFabOpen ? "rotate-45 scale-90 bg-gray-100" : "active:scale-90"
        )}
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, onClick, active = false }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-red-50 text-[#b71700] shadow-sm' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-[#b71700]' : 'text-gray-400'}`} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function FeaturedCard({ title, subtitle, tag, image, tagColor, url }: any) {
  const content = (
    <div className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
      <img 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        src={image} 
        alt={title}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
        {tag && <span className={`${tagColor} text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-2`}>{tag}</span>}
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <p className="text-white/80 text-xs">{subtitle}</p>
      </div>
    </div>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}

function NavItem({ icon: Icon, label, active = false, onClick, showWave = false }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-full transition-all relative",
        active ? 'bg-red-50 text-[#b71700]' : 'text-gray-400 hover:text-[#b71700]'
      )}
    >
      <div className="relative">
        {showWave && (
          <>
            <div className="absolute inset-0 bg-[#b71700]/20 rounded-full animate-glow-wave" />
            <div className="absolute inset-0 bg-[#b71700]/10 rounded-full animate-glow-wave [animation-delay:1s]" />
          </>
        )}
        <Icon className="w-6 h-6 relative z-10" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest relative z-10">{label}</span>
    </button>
  );
}
