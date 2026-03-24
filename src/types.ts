export interface DirectoryItem {
  name: string;
  subCategory: string;
  category: string;
  mobile: string;
  location: string;
  website: string;
  whatsapp: string;
  images: string[];
  verified: boolean;
  info: string;
  tag: string;
  mapPin: string;
}

export type Screen = 'welcome' | 'dashboard' | 'phonebook' | 'rental' | 'property' | 'jobs' | 'food' | 'weather' | 'apmc' | 'shopping' | 'realestate';
