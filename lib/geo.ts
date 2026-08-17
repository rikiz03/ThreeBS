export interface GeoInfo {
    countryCode: string;
    currency: string;
    locale: string;
    symbol: string;
    rate: number;
}

const COUNTRY_MAP: Record<string, { currency: string; locale: string; symbol: string; rate: number }> = {
    // English-speaking
    'US': { currency: 'USD', locale: 'en', symbol: '$', rate: 1.0 },
    'GB': { currency: 'GBP', locale: 'en', symbol: '£', rate: 0.8 },
    'CA': { currency: 'CAD', locale: 'en', symbol: 'C$', rate: 1.35 },
    'AU': { currency: 'AUD', locale: 'en', symbol: 'A$', rate: 1.52 },
    'NG': { currency: 'NGN', locale: 'en', symbol: '₦', rate: 1600 },
    'ZA': { currency: 'ZAR', locale: 'en', symbol: 'R', rate: 18.5 },
    'KE': { currency: 'KES', locale: 'en', symbol: 'KSh', rate: 130 },
    'GH': { currency: 'GHS', locale: 'en', symbol: 'GH₵', rate: 14 },
    'IN': { currency: 'INR', locale: 'en', symbol: '₹', rate: 83 },
    'PH': { currency: 'PHP', locale: 'en', symbol: '₱', rate: 56 },

    // German-speaking
    'DE': { currency: 'EUR', locale: 'de', symbol: '€', rate: 0.92 },
    'AT': { currency: 'EUR', locale: 'de', symbol: '€', rate: 0.92 },

    // Spanish-speaking (Spain + Latin America)
    'ES': { currency: 'EUR', locale: 'es', symbol: '€', rate: 0.92 },
    'MX': { currency: 'MXN', locale: 'es', symbol: '$', rate: 17 },
    'AR': { currency: 'ARS', locale: 'es', symbol: '$', rate: 900 },
    'CO': { currency: 'COP', locale: 'es', symbol: '$', rate: 3900 },
    'PE': { currency: 'PEN', locale: 'es', symbol: 'S/', rate: 3.7 },
    'VE': { currency: 'VES', locale: 'es', symbol: 'Bs', rate: 40 },
    'CL': { currency: 'CLP', locale: 'es', symbol: '$', rate: 950 },
    'EC': { currency: 'USD', locale: 'es', symbol: '$', rate: 1 },
    'GT': { currency: 'GTQ', locale: 'es', symbol: 'Q', rate: 7.8 },
    'CR': { currency: 'CRC', locale: 'es', symbol: '₡', rate: 530 },
    'DO': { currency: 'DOP', locale: 'es', symbol: 'RD$', rate: 60 },
    'UY': { currency: 'UYU', locale: 'es', symbol: '$U', rate: 40 },
    'PA': { currency: 'USD', locale: 'es', symbol: 'B/.', rate: 1 },
    'PR': { currency: 'USD', locale: 'es', symbol: '$', rate: 1 },
    'BO': { currency: 'BOB', locale: 'es', symbol: 'Bs', rate: 7 },
    'PY': { currency: 'PYG', locale: 'es', symbol: '₲', rate: 7500 },
    'HN': { currency: 'HNL', locale: 'es', symbol: 'L', rate: 25 },
    'SV': { currency: 'USD', locale: 'es', symbol: '$', rate: 1 },
    'NI': { currency: 'NIO', locale: 'es', symbol: 'C$', rate: 37 },
    'CU': { currency: 'CUP', locale: 'es', symbol: '$', rate: 120 },

    // French-speaking
    'FR': { currency: 'EUR', locale: 'fr', symbol: '€', rate: 0.92 },
    'BE': { currency: 'EUR', locale: 'fr', symbol: '€', rate: 0.92 },
    'SN': { currency: 'XOF', locale: 'fr', symbol: 'FCFA', rate: 610 },
    'CI': { currency: 'XOF', locale: 'fr', symbol: 'FCFA', rate: 610 },
    'CM': { currency: 'XAF', locale: 'fr', symbol: 'FCFA', rate: 610 },
    'MG': { currency: 'MGA', locale: 'fr', symbol: 'Ar', rate: 4500 },
    'BF': { currency: 'XOF', locale: 'fr', symbol: 'FCFA', rate: 610 },
    'ML': { currency: 'XOF', locale: 'fr', symbol: 'FCFA', rate: 610 },
    'TG': { currency: 'XOF', locale: 'fr', symbol: 'FCFA', rate: 610 },
    'BJ': { currency: 'XOF', locale: 'fr', symbol: 'FCFA', rate: 610 },
    'NE': { currency: 'XOF', locale: 'fr', symbol: 'FCFA', rate: 610 },
    'CD': { currency: 'CDF', locale: 'fr', symbol: 'FC', rate: 2700 },
    'HT': { currency: 'HTG', locale: 'fr', symbol: 'G', rate: 130 },

    // Arabic-speaking
    'SA': { currency: 'SAR', locale: 'ar', symbol: 'ر.س', rate: 3.75 },
    'AE': { currency: 'AED', locale: 'ar', symbol: 'د.إ', rate: 3.67 },
    'EG': { currency: 'EGP', locale: 'ar', symbol: 'ج.م', rate: 50 },
    'IQ': { currency: 'IQD', locale: 'ar', symbol: 'د.ع', rate: 1310 },
    'JO': { currency: 'JOD', locale: 'ar', symbol: 'د.أ', rate: 0.71 },
    'KW': { currency: 'KWD', locale: 'ar', symbol: 'د.ك', rate: 0.31 },
    'QA': { currency: 'QAR', locale: 'ar', symbol: 'ر.ق', rate: 3.64 },
    'BH': { currency: 'BHD', locale: 'ar', symbol: '.د.ب', rate: 0.38 },
    'OM': { currency: 'OMR', locale: 'ar', symbol: 'ر.ع', rate: 0.38 },
    'YE': { currency: 'YER', locale: 'ar', symbol: '﷼', rate: 250 },
    'SY': { currency: 'SYP', locale: 'ar', symbol: 'ل.س', rate: 13000 },
    'LB': { currency: 'LBP', locale: 'ar', symbol: 'ل.ل', rate: 89500 },
    'PS': { currency: 'ILS', locale: 'ar', symbol: '₪', rate: 3.7 },
    'SD': { currency: 'SDG', locale: 'ar', symbol: 'ج.س', rate: 600 },
    'LY': { currency: 'LYD', locale: 'ar', symbol: 'ل.د', rate: 4.8 },
    'TN': { currency: 'TND', locale: 'ar', symbol: 'د.ت', rate: 3.1 },
    'MA': { currency: 'MAD', locale: 'ar', symbol: 'د.م', rate: 10 },
    'DZ': { currency: 'DZD', locale: 'ar', symbol: 'د.ج', rate: 135 },
    'MR': { currency: 'MRU', locale: 'ar', symbol: 'أ.م', rate: 37 },
};

export async function detectUserLocation(): Promise<GeoInfo> {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code || 'US';
        const info = COUNTRY_MAP[countryCode] || COUNTRY_MAP['US'];

        // Fetch live exchange rate
        let liveRate = info.rate;
        try {
            const rateRes = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
            const rateData = await rateRes.json();
            if (rateData.rates && rateData.rates[info.currency]) {
                liveRate = rateData.rates[info.currency];
                console.log(`Live rate for ${info.currency}: ${liveRate}`);
            }
        } catch (e) {
            console.warn('Failed to fetch live rate, using fallback:', e);
        }

        return {
            countryCode,
            ...info,
            rate: liveRate
        };
    } catch (error) {
        console.error('Geolocation detection failed:', error);
        return {
            countryCode: 'US',
            ...COUNTRY_MAP['US']
        };
    }
}

export function getCurrencyInfo(currency: string): { symbol: string; rate: number } {
    const entry = Object.values(COUNTRY_MAP).find(c => c.currency === currency);
    return entry ? { symbol: entry.symbol, rate: entry.rate } : { symbol: '$', rate: 1.0 };
}

export function formatPrice(price: number, currency: string): string {
    const info = getCurrencyInfo(currency);
    const convertedPrice = price * info.rate;
    return `${info.symbol}${convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
