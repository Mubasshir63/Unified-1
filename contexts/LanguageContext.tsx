import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import translations from '../translations';
import type { Language } from '../types';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations['en'], params?: { [key: string]: string | number }) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => {},
    t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const savedLang = localStorage.getItem('appLanguage');
        return (savedLang || 'en') as Language;
    });

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = useCallback((key: keyof typeof translations['en'], params?: { [key: string]: string | number }) => {
        const langStrings = translations[language] || translations.en;
        let text = langStrings[key] || translations.en[key] || key;

        if (params) {
            Object.keys(params).forEach(paramKey => {
                const regex = new RegExp(`{${paramKey}}`, 'g');
                text = text.replace(regex, String(params[paramKey]));
            });
        }
        return text;
    }, [language]);

    const value = { language, setLanguage, t };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
