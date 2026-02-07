"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";
import { ArrowLeft, Play, TrendingUp, Users, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchPublicWorldCups } from "@/app/actions";

interface SharedWorldCup {
    id: string;
    title: string;
    rounds: number;
    plays: number;
    likes: number;
    characters: any[];
}

export default function CommunityPage() {
    const { t } = useLanguage();
    const [worldCups, setWorldCups] = useState<SharedWorldCup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPublicWorldCups();
                setWorldCups(data.map((item: any) => ({
                    ...item,
                    plays: item.plays || 0,
                    likes: item.likes || 0
                })));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <main className="min-h-screen p-6 md:p-12 bg-background">
            <LanguageSwitcher />

            <div className="max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="glass p-3 rounded-2xl hover:bg-white/10 transition-all text-muted-foreground hover:text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black mb-2">{t("communityBtn")}</h1>
                            <p className="text-muted-foreground font-medium">전세계 사람들이 만든 최고의 월드컵을 즐겨보세요.</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4 glass px-6 py-3 rounded-2xl border-white/5">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="font-bold text-sm tracking-widest uppercase">Currently Trending</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {worldCups.map((wc, idx) => (
                        <motion.div
                            key={wc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="glass rounded-[2rem] overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/30 transition-all"
                        >
                            <div className="aspect-square relative overflow-hidden">
                                <img
                                    src={wc.characters?.[0]?.image_url || "https://picsum.photos/400/400"}
                                    alt={wc.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="premium-gradient p-4 rounded-full shadow-2xl"
                                    >
                                        <Play className="w-8 h-8 fill-white" />
                                    </motion.button>
                                </div>
                                <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold text-white">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    {wc.rounds}강
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-4 line-clamp-1 group-hover:text-primary transition-colors text-white">
                                    {wc.title}
                                </h3>

                                <div className="flex items-center justify-between text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <Users className="w-3.5 h-3.5" />
                                            {wc.plays.toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                                            {wc.likes}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50">BY COMMUNITY</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
