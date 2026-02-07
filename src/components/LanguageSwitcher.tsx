"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { Language } from "@/translations";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const langs: { code: Language; label: string }[] = [
        { code: "ko", label: "한국어" },
        { code: "en", label: "EN" },
        { code: "ja", label: "日本語" },
    ];

    return (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 glass px-4 py-2 rounded-full">
            <Globe className="w-4 h-4 opacity-50" />
            <div className="flex gap-4 text-xs font-medium">
                {langs.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`transition-colors hover:text-primary ${language === lang.code ? "text-primary" : "text-muted-foreground"
                            }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
