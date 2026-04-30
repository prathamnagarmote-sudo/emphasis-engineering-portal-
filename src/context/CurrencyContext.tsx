"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 'CAD' | 'USD' | 'GBP' | 'INR' | 'AED';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  rate: number; // Rate relative to CAD (Base)
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  CAD: { code: 'CAD', symbol: '$', label: 'CAD', flag: '🇨🇦', rate: 1 },
  USD: { code: 'USD', symbol: '$', label: 'USD', flag: '🇺🇸', rate: 0.74 },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP', flag: '🇬🇧', rate: 0.58 },
  INR: { code: 'INR', symbol: '₹', label: 'INR', flag: '🇮🇳', rate: 62.0 },
  AED: { code: 'AED', symbol: 'د.إ', label: 'AED', flag: '🇦🇪', rate: 2.72 },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceCAD: number) => string;
  convertPrice: (priceCAD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES.CAD);
  const [rates, setRates] = useState<Record<string, number>>({
    CAD: 1,
    USD: 0.74,
    GBP: 0.58,
    INR: 62.0,
    AED: 2.72,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize and Fetch
  useEffect(() => {
    const initCurrency = async () => {
      // 1. Check Local Storage for preference
      const saved = localStorage.getItem('user-currency');
      
      // 2. Try to fetch rates from Session Storage first (cache)
      const cachedRates = sessionStorage.getItem('currency-rates');
      if (cachedRates) {
        try {
          const parsed = JSON.parse(cachedRates);
          // Ensure cache is not too old (e.g., 24h)
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setRates(parsed.rates);
          }
        } catch (e) {
          console.error('Error parsing cached rates');
        }
      }

      // 3. Fetch fresh rates and auto-detect if no saved preference
      try {
        const [ratesRes, geoRes] = await Promise.all([
          fetch('https://open.er-api.com/v6/latest/CAD'),
          !saved ? fetch('https://ipapi.co/json/').catch(() => null) : Promise.resolve(null)
        ]);

        if (ratesRes.ok) {
          const data = await ratesRes.json();
          if (data && data.rates) {
            const newRates = {
              CAD: 1,
              USD: data.rates.USD || 0.74,
              GBP: data.rates.GBP || 0.58,
              INR: data.rates.INR || 62.0,
              AED: data.rates.AED || 2.72,
            };
            setRates(newRates);
            sessionStorage.setItem('currency-rates', JSON.stringify({
              rates: newRates,
              timestamp: Date.now()
            }));
          }
        }

        // Auto-detection logic
        if (!saved && geoRes && geoRes.ok) {
          const geoData = await geoRes.json();
          const detectedCurrency = geoData.currency;
          if (detectedCurrency && CURRENCIES[detectedCurrency as CurrencyCode]) {
            setCurrencyState(CURRENCIES[detectedCurrency as CurrencyCode]);
            console.log('Auto-detected currency:', detectedCurrency);
          }
        } else if (saved && CURRENCIES[saved as CurrencyCode]) {
          setCurrencyState(CURRENCIES[saved as CurrencyCode]);
        }
      } catch (err) {
        console.error('Optimization error:', err);
        if (saved && CURRENCIES[saved as CurrencyCode]) {
          setCurrencyState(CURRENCIES[saved as CurrencyCode]);
        }
      } finally {
        setIsLoaded(true);
      }
    };

    initCurrency();

    // Auto-refresh rates every 60 minutes
    const interval = setInterval(async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/CAD');
        if (res.ok) {
          const data = await res.json();
          const newRates = {
            CAD: 1,
            USD: data.rates.USD || 0.74,
            GBP: data.rates.GBP || 0.58,
            INR: data.rates.INR || 62.0,
            AED: data.rates.AED || 2.72,
          };
          setRates(newRates);
        }
      } catch (e) {}
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    const newCurrency = CURRENCIES[code];
    setCurrencyState(newCurrency);
    localStorage.setItem('user-currency', code);
  };

  const convertPrice = (priceCAD: number) => {
    const rate = rates[currency.code] || CURRENCIES[currency.code].rate;
    return priceCAD * rate;
  };

  const formatPrice = (priceCAD: number) => {
    const converted = convertPrice(priceCAD);
    
    // For INR and AED, people often prefer whole numbers, but for "perfect" trust, 
    // we will show 2 decimals to match global standards like Google.
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
