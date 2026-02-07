"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createWorldCupAction, generateAndSaveCharactersAction } from "@/app/actions";

export default function GeneratePage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const hasStarted = useRef(false);

    const steps = [
        "AI 엔진 초기화 중...",
        "캐릭터 컨셉 드로잉...",
        "디테일 셰이딩 및 채색...",
        "토너먼트 대진표 구성 중...",
        "월드컵 준비 완료!"
    ];

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        const startGeneration = async () => {
            const saved = localStorage.getItem("current_wc_config");
            if (!saved) {
                router.push("/create");
                return;
            }

            const config = JSON.parse(saved);

            try {
                // Step 1: Initialize (0-20%)
                setProgress(20);
                setCurrentStep(0);

                // Step 2: Create World Cup Record in Supabase
                const worldCup = await createWorldCupAction({
                    title: config.title,
                    rounds: config.rounds,
                    isPublic: config.isPublic
                });

                setProgress(40);
                setCurrentStep(1);

                // Step 3: Generate via Gemini and Save Characters
                const characters = await generateAndSaveCharactersAction(
                    worldCup.id,
                    config.prompt,
                    config.rounds
                );

                setProgress(80);
                setCurrentStep(3);

                // Finalize
                localStorage.setItem("current_wc_data", JSON.stringify({
                    worldCupId: worldCup.id,
                    characters
                }));

                setProgress(100);
                setCurrentStep(4);

                setTimeout(() => router.push("/play"), 1500);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "AI 생성 중 오류가 발생했습니다. API 키 설정을 확인해주세요.");
            }
        };

        startGeneration();
    }, [router]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background overflow-hidden relative">
            {/* Background Pulse */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute w-[500px] h-[500px] bg-primary/30 blur-[120px] rounded-full"
            />

            <div className="w-full max-w-2xl relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="inline-flex p-4 rounded-3xl bg-primary/10 mb-6">
                        {progress < 100 ? (
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        ) : (
                            <CheckCircle className="w-12 h-12 text-green-400" />
                        )}
                    </div>
                    <h2 className="text-4xl font-black mb-4">{t("generating")}</h2>
                    <p className="text-xl text-muted-foreground h-8">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {steps[currentStep]}
                            </motion.span>
                        </AnimatePresence>
                    </p>
                </motion.div>

                {/* Progress Bar Container */}
                <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 mb-8">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="absolute top-0 left-0 h-full premium-gradient"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="glass p-6 rounded-2xl flex flex-col items-center gap-2">
                        <span className="text-muted-foreground uppercase tracking-wider">{t("progress")}</span>
                        <span className="text-3xl font-black">{Math.floor(progress)}%</span>
                    </div>
                    <div className="glass p-6 rounded-2xl flex flex-col items-center gap-2">
                        <span className="text-muted-foreground uppercase tracking-wider">{t("timeRemaining")}</span>
                        <span className="text-3xl font-black">
                            {Math.max(0, Math.ceil((100 - progress) / 20))} {t("seconds")}
                        </span>
                    </div>
                </div>

                {/* Character Preview Silhouettes */}
                <div className="mt-12 flex justify-center gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.1, 0.3, 0.1] }}
                            transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
                            className="w-16 h-24 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center"
                        >
                            <Sparkles className="w-4 h-4 text-primary/20" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
