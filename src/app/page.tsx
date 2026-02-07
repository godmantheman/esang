"use client";

import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";
import { Play, Users, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />

      <LanguageSwitcher />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="premium-text-gradient">AI Powered Creation</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
          {t("heroTitle").split(" ").map((word, i) => (
            <span key={i} className={i === 1 ? "premium-text-gradient" : ""}>
              {word}{" "}
            </span>
          ))}
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
          {t("heroSubtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="premium-gradient px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-primary/20 text-lg hover:shadow-primary/40 transition-all"
            >
              <Play className="w-5 h-5 fill-white" />
              {t("startBtn")}
            </motion.button>
          </Link>

          <Link href="/community">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-2xl font-bold flex items-center gap-3 text-lg hover:bg-white/5 transition-all"
            >
              <Users className="w-5 h-5text-white" />
              {t("communityBtn")}
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Mini Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 flex gap-12 text-sm text-muted-foreground uppercase tracking-widest font-bold"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-xl">1.2k+</span>
          <span>Wars Played</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-xl">450+</span>
          <span>AI Characters</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-xl">89%</span>
          <span>Satisfaction</span>
        </div>
      </motion.div>
    </main>
  );
}
