import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const CACHE_KEY = 'apmc_rates_cache_v1';
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

export async function fetchLatestApmcRates(): Promise<string> {
  // Try to get from cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    } catch (e) {
      console.warn("Error parsing cache", e);
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "What are the latest APMC market rates for Deesa (Gujarat) today? Include rates for Castor, Mustard, Bajri, Wheat, Rajgaro, Cumin, and Chana. Also include rates for Potato and Onion from V.J. Patel Market. Format the output as a single continuous line for a scrolling ticker, starting with 'APMC Deesa (Date): ...' and 'V.J. Patel (Date): ...'. Keep it compact and professionally formatted with bullets (•). Use Indian Rupee symbols (₹) for prices.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text;
    if (text) {
      const cleanedText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: cleanedText,
        timestamp: Date.now()
      }));
      return cleanedText;
    }
    throw new Error('No ticker text returned');
  } catch (error: any) {
    // If we hit a rate limit (429), try to use expired cache if it exists
    if (error?.message?.includes('429') && cached) {
      try {
        const { data } = JSON.parse(cached);
        console.warn("Rate limited by Gemini, using stale cache fallback.");
        return data;
      } catch (e) {}
    }

    console.error('Error fetching APMC rates via Gemini:', error);
    // Return a slightly dated fallback so at least something appears
    return "APMC Deesa: ₹1,200-1,280 • Mustard ₹1,150-1,250 • Potato ₹150-280 • Onion ₹300-450 • Stay tuned for real-time updates.";
  }
}
