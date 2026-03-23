import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, Menu, SlidersHorizontal, Contact, Key, Building2, 
  Briefcase, Utensils, Compass, Cloud, Tractor, 
  ShoppingBag, Home, LayoutGrid, User, Plus
} from 'lucide-react';
import { Screen } from '../types';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const categories = [
    { id: 'phonebook', name: 'Phonebook', icon: Contact, color: 'bg-red-50 text-[#b71700]', screen: 'phonebook' },
    { id: 'rental', name: 'Rental', icon: Key, color: 'bg-yellow-50 text-[#6d5e00]', screen: 'rental' },
    { id: 'property', name: 'Property', icon: Building2, color: 'bg-blue-50 text-blue-700', screen: 'property' },
    { id: 'jobs', name: 'Job Vacancies', icon: Briefcase, color: 'bg-green-50 text-emerald-700', screen: 'jobs' },
    { id: 'food', name: 'Food', icon: Utensils, color: 'bg-orange-50 text-orange-700', screen: 'food' },
    { id: 'explore', name: 'Explore City', icon: Compass, color: 'bg-purple-50 text-purple-700', screen: 'dashboard' },
    { id: 'weather', name: 'Weather', icon: Cloud, color: 'bg-sky-50 text-sky-700', screen: 'weather' },
    { id: 'apmc', name: 'APMC', icon: Tractor, color: 'bg-amber-50 text-amber-700', screen: 'apmc' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-rose-50 text-rose-700', screen: 'shopping' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff] pb-28">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center px-6 h-16 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <button className="text-[#b71700] p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black tracking-tighter text-[#b71700]">MyDeesa</h1>
          </div>
          <button className="text-[#b71700] p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-6 h-6" />
          </button>
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
              animate={{ x: [0, -400] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-sm font-medium"
            >
              New APMC Rates Updated • Local Festival in Market Square • Weather: Clear Sky 28°C • Property Listings Updated
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
        <section className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-6 gap-x-4">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(cat.screen as Screen)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`w-20 h-20 ${cat.color} rounded-full flex items-center justify-center transition-all group-hover:brightness-95 shadow-sm`}>
                <cat.icon className="w-12 h-12" />
              </div>
              <span className="text-[11px] font-bold text-center text-gray-600 uppercase tracking-tight leading-tight">{cat.name}</span>
            </motion.button>
          ))}
        </section>

        {/* Featured Spotlights */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#b71700] rounded-full"></span>
            Featured Spotlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full rounded-t-2xl z-50 bg-white/90 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)] h-20 px-4 flex justify-around items-center">
        <NavItem icon={Home} label="Home" active onClick={() => onNavigate('dashboard')} />
        <NavItem icon={LayoutGrid} label="Services" onClick={() => onNavigate('dashboard')} />
        <NavItem icon={Compass} label="Explore" onClick={() => onNavigate('dashboard')} />
        <NavItem icon={Briefcase} label="Jobs" onClick={() => onNavigate('jobs')} />
        <NavItem icon={ShoppingBag} label="Shopping" onClick={() => onNavigate('shopping')} />
      </nav>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#fedf36] text-[#211b00] rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}

function FeaturedCard({ title, subtitle, tag, image, tagColor }: any) {
  return (
    <div className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
      <img 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        src={image} 
        alt={title}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
        <span className={`${tagColor} text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-2`}>{tag}</span>
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <p className="text-white/80 text-xs">{subtitle}</p>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-full transition-all ${active ? 'bg-red-50 text-[#b71700]' : 'text-gray-400 hover:text-[#b71700]'}`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
