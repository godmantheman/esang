"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";
import { ArrowLeft, Wand2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreatePage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [rounds, setRounds] = useState(16);
    const [prompt, setPrompt] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    const roundOptions = [8, 16, 32, 64];

    const handleCreate = async () => {
        if (!prompt.trim()) return;

        try {
            // 1. Store configuration locally for the generation page
            localStorage.setItem("current_wc_config", JSON.stringify({
                title: prompt.slice(0, 20) + " 이상형 월드컵",
                rounds,
                prompt,
                isPublic
            }));

            router.push("/generate");
        } catch (error) {
            alert("생성 준비 중 오류가 발생했습니다.");
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
            <LanguageSwitcher />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl glass p-8 rounded-[2rem] relative overflow-hidden"
            >
                <Link href="/" className="absolute top-8 left-8 text-muted-foreground hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2">{t("startBtn")}</h2>
                    <p className="text-muted-foreground">AI가 당신의 상상을 그려냅니다.</p>
                </div>

                <div className="space-y-8">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                            {t("selectRounds")}
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {roundOptions.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setRounds(opt)}
                                    className={`py-3 rounded-xl font-bold transition-all ${rounds === opt
                                        ? "premium-gradient shadow-lg shadow-primary/20 scale-105"
                                        : "bg-white/5 hover:bg-white/10 text-muted-foreground"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                            {t("promptPlaceholder")}
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t("promptPlaceholder")}
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-lg"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                        <div className="flex flex-col">
                            <span className="font-bold">공개 여부</span>
                            <span className="text-xs text-muted-foreground">커뮤니티에 공개하여 통계를 쌓습니다.</span>
                        </div>
                        <button
                            onClick={() => setIsPublic(!isPublic)}
                            className={`w-12 h-6 rounded-full transition-all relative ${isPublic ? "bg-primary" : "bg-white/10"
                                }`}
                        >
                            <div
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPublic ? "left-7" : "left-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreate}
                        disabled={!prompt.trim()}
                        className="w-full premium-gradient py-4 rounded-2xl font-bold flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
                    >
                        <Wand2 className="w-5 h-5" />
                        {t("generateBtn")}
                    </motion.button>
                </div>
            </motion.div>
        </main>
    );
}
