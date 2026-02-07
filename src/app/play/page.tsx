"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Swords, History } from "lucide-react";
import { useRouter } from "next/navigation";

interface Character {
    id: number;
    name: string;
    imageUrl: string;
}

export default function PlayPage() {
    const { t } = useLanguage();
    const router = useRouter();

    const [rounds, setRounds] = useState<number>(16);
    const [candidates, setCandidates] = useState<Character[]>([]);
    const [winners, setWinners] = useState<Character[]>([]);
    const [currentPair, setCurrentPair] = useState<[Character, Character] | null>(null);
    const [matchIndex, setMatchIndex] = useState(0);
    const [currentRoundTotal, setCurrentRoundTotal] = useState(16);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("current_wc_data");
        if (!saved) {
            router.push("/create");
            return;
        }
        const data = JSON.parse(saved);
        const chars = data.characters;
        setRounds(chars.length);
        setCurrentRoundTotal(chars.length);

        // Shuffle candidates
        const shuffled = [...chars].sort(() => Math.random() - 0.5);
        setCandidates(shuffled);
        setCurrentPair([shuffled[0], shuffled[1]]);
    }, [router]);

    const handlePick = (winner: Character) => {
        const newWinners = [...winners, winner];
        setWinners(newWinners);

        const nextMatchIndex = matchIndex + 2;

        if (nextMatchIndex < candidates.length) {
            // Next match in current round
            setMatchIndex(nextMatchIndex);
            setCurrentPair([candidates[nextMatchIndex], candidates[nextMatchIndex + 1]]);
        } else {
            // Current round finished
            if (newWinners.length === 1) {
                // Final winner found!
                setIsGameOver(true);
                localStorage.setItem("last_winner", JSON.stringify(winner));
                return;
            }

            // Move to next round
            setCandidates(newWinners);
            setWinners([]);
            setMatchIndex(0);
            setCurrentRoundTotal(newWinners.length);
            setCurrentPair([newWinners[0], newWinners[1]]);
        }
    };

    if (isGameOver) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-5xl font-black mb-8 premium-text-gradient">우승자 탄생!</h2>
                    <div className="glass p-4 rounded-[2.5rem] mb-12">
                        <img
                            src={candidates[0]?.imageUrl}
                            className="w-80 h-[120] object-cover rounded-[2rem] shadow-2xl"
                            alt="Winner"
                        />
                        <h3 className="text-2xl font-bold mt-6">{candidates[0]?.name}</h3>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="premium-gradient px-12 py-4 rounded-2xl font-bold text-xl"
                    >
                        결과 기록하고 홈으로
                    </button>
                </motion.div>
            </main>
        );
    }

    if (!currentPair) return null;

    return (
        <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden bg-black">
            {/* HUD */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 glass px-8 py-3 rounded-full border-white/20">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Round</span>
                    <span className="text-xl font-black text-primary italic">
                        {currentRoundTotal === 2 ? "FINAL" : `${currentRoundTotal}강`}
                    </span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Match</span>
                    <span className="text-xl font-black italic">
                        {matchIndex / 2 + 1} / {currentRoundTotal / 2}
                    </span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {currentPair.map((candidate, idx) => (
                    <motion.div
                        key={`${candidate.id}-${currentRoundTotal}`}
                        initial={{ x: idx === 0 ? -100 : 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: idx === 0 ? -200 : 200, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        onClick={() => handlePick(candidate)}
                        className="relative h-full cursor-pointer group overflow-hidden"
                    >
                        <img
                            src={candidate.imageUrl}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={candidate.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        <div className="absolute bottom-12 left-12 right-12">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="glass p-6 rounded-3xl border-white/10"
                            >
                                <h3 className="text-3xl font-black text-white mb-2">{candidate.name}</h3>
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="text-xs font-bold uppercase tracking-widest">Select this candidate</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 rounded-full glass border-primary/50 flex items-center justify-center bg-primary/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(168,85,247,0.3)]"
                >
                    <Swords className="w-12 h-12 text-primary" />
                </motion.div>
            </div>
        </main>
    );
}
