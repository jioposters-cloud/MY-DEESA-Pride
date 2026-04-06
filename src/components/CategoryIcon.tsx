import React from 'react';
import { 
  Calculator, Scale, Tractor, Car, Landmark, Stethoscope, 
  HardHat, Key, Snowflake, Monitor, Utensils, Briefcase, 
  Home, Cloud, ShoppingBag, Contact, Compass, GraduationCap, 
  Scissors, Zap, Plane, HelpCircle, Camera, 
  Music, Film, Coffee, Truck, Wrench, Heart, ShoppingCart
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CategoryIconProps {
  category: string;
  className?: string;
  active?: boolean;
}

const colorSchemes = [
  { bg: 'bg-red-50', icon: 'text-red-600', activeBg: 'bg-red-600', activeIcon: 'text-white' },
  { bg: 'bg-blue-50', icon: 'text-blue-600', activeBg: 'bg-blue-600', activeIcon: 'text-white' },
  { bg: 'bg-green-50', icon: 'text-green-600', activeBg: 'bg-green-600', activeIcon: 'text-white' },
  { bg: 'bg-yellow-50', icon: 'text-yellow-700', activeBg: 'bg-yellow-400', activeIcon: 'text-white' },
  { bg: 'bg-purple-50', icon: 'text-purple-600', activeBg: 'bg-purple-600', activeIcon: 'text-white' },
  { bg: 'bg-orange-50', icon: 'text-orange-600', activeBg: 'bg-orange-600', activeIcon: 'text-white' },
  { bg: 'bg-pink-50', icon: 'text-pink-600', activeBg: 'bg-pink-600', activeIcon: 'text-white' },
  { bg: 'bg-indigo-50', icon: 'text-indigo-600', activeBg: 'bg-indigo-600', activeIcon: 'text-white' },
  { bg: 'bg-teal-50', icon: 'text-teal-600', activeBg: 'bg-teal-600', activeIcon: 'text-white' },
];

export const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('accountant') || cat.includes('c.a') || cat.includes('tax')) return Calculator;
  if (cat.includes('advocate') || cat.includes('lawyer') || cat.includes('legal')) return Scale;
  if (cat.includes('agriculture') || cat.includes('farm') || cat.includes('tractor')) return Tractor;
  if (cat.includes('automobile') || cat.includes('car') || cat.includes('bike') || cat.includes('garage') || cat.includes('tyre')) return Car;
  if (cat.includes('bank') || cat.includes('finance')) return Landmark;
  if (cat.includes('blood') || cat.includes('hospital') || cat.includes('doctor') || cat.includes('medical') || cat.includes('clinic') || cat.includes('pharmacy')) return Stethoscope;
  if (cat.includes('building') || cat.includes('construction') || cat.includes('material') || cat.includes('hardware')) return HardHat;
  if (cat.includes('rent')) return Key;
  if (cat.includes('cold') || cat.includes('storage') || cat.includes('ice')) return Snowflake;
  if (cat.includes('computer') || cat.includes('it') || cat.includes('service') || cat.includes('software')) return Monitor;
  if (cat.includes('food') || cat.includes('restaurant') || cat.includes('hotel') || cat.includes('cafe') || cat.includes('bakery')) return Utensils;
  if (cat.includes('job') || cat.includes('vacancy')) return Briefcase;
  if (cat.includes('property') || cat.includes('real estate')) return Home;
  if (cat.includes('weather')) return Cloud;
  if (cat.includes('shopping') || cat.includes('store') || cat.includes('mall') || cat.includes('gift') || cat.includes('cloth')) return ShoppingBag;
  if (cat.includes('phone') || cat.includes('contact') || cat.includes('directory')) return Contact;
  if (cat.includes('explore') || cat.includes('city') || cat.includes('tour')) return Compass;
  if (cat.includes('education') || cat.includes('school') || cat.includes('college') || cat.includes('tuition') || cat.includes('library')) return GraduationCap;
  if (cat.includes('beauty') || cat.includes('parlor') || cat.includes('salon') || cat.includes('spa')) return Scissors;
  if (cat.includes('electronic') || cat.includes('electric') || cat.includes('mobile')) return Zap;
  if (cat.includes('travel') || cat.includes('tour') || cat.includes('bus') || cat.includes('taxi')) return Plane;
  if (cat.includes('photo') || cat.includes('video') || cat.includes('studio')) return Camera;
  if (cat.includes('music') || cat.includes('dj') || cat.includes('sound')) return Music;
  if (cat.includes('film') || cat.includes('cinema') || cat.includes('theater')) return Film;
  if (cat.includes('coffee') || cat.includes('tea')) return Coffee;
  if (cat.includes('truck') || cat.includes('transport') || cat.includes('courier')) return Truck;
  if (cat.includes('service') || cat.includes('repair') || cat.includes('maintenance')) return Wrench;
  if (cat.includes('heart') || cat.includes('charity') || cat.includes('ngo')) return Heart;
  if (cat.includes('cart') || cat.includes('grocery')) return ShoppingCart;
  
  return HelpCircle;
};

export const getCategoryColor = (category: string) => {
  // Simple hash to get a consistent color for a category
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorSchemes.length;
  return colorSchemes[index];
};

export default function CategoryIcon({ category, className, active = false }: CategoryIconProps) {
  const Icon = getCategoryIcon(category);
  const colors = getCategoryColor(category);

  return (
    <div className={cn(
      "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-sm ring-2 ring-transparent",
      active ? colors.activeBg : colors.bg,
      className
    )}>
      <Icon className={cn(
        "w-8 h-8",
        active ? colors.activeIcon : colors.icon
      )} />
    </div>
  );
}
