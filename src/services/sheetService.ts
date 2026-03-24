import Papa from 'papaparse';
import { DirectoryItem } from '../types';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJy-xzoHUd_Mv8wL4fZNJW9PO7u2bPsanbYNAQX2dxjyd8I3K1ZFUb_pNAfPSgbmq6PKS1pwtILbVJ/pub?gid=462474319&single=true&output=csv';

export async function fetchDirectoryData(): Promise<DirectoryItem[]> {
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const items: DirectoryItem[] = results.data.map((row: any) => ({
            name: row['Name'] || '',
            subCategory: row['Sub category'] || '',
            category: row['Category'] || '',
            mobile: row['Mobile'] || '',
            location: row['Location'] || '',
            website: row['Website'] || '',
            whatsapp: row['WhatsApp'] || '',
            images: [row['image 1'], row['image 2'], row['image 3']].filter(img => img && typeof img === 'string' && img.startsWith('http')),
            verified: String(row['Verified'] || '').toLowerCase().includes('verified'),
            info: row['info'] || '',
            tag: row['Tag'] || '',
            mapPin: row['Map pin'] || '',
          })).filter(item => item.name && !item.name.includes('NAMSt') && !item.name.includes('NUMSt') && !item.name.includes('NAMEnd') && !item.name.includes('NUMEnd'));
          
          resolve(items);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching directory data:', error);
    return [];
  }
}
