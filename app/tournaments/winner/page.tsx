"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTournamentData } from "@/hooks/useTournamentData";
import { TournamentBracket } from "@/components/TournamentBracket";
import { WinnerCard } from "@/components/WinnerCard";
import { useConfetti } from "@/hooks/useConfetti";
import { Loader2 } from "lucide-react";

// Array de GIFs futboleros (agregar al inicio del archivo)
const SOCCER_GIFS = [
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbng2c2V3bHQ1a245cHlxODdhazU1Y3pmZHNrZmllZTE0dHJ3a2JqNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TjAcxImn74uoDYVxFl/giphy.webp", // Gol espectacular
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3JiNXV1dXd4bHo2bDhuMmI4ZTQzYWg5OHQxZGJ1bWt6c2Q3dHJiMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUA7aT4k7JLXH71zG0/giphy.webp",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnJudDBsOWsyNG9xZHhrYzNjcDJmOXUzbXh0M21oeTBkZ2tlZWd4MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AecCpGuDM2G2129qn1/giphy.webp",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHFkbTg4MXU1djBsNDliMGZueXpsbmkwYzFrOWpmeHlsYjR3MzAyMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Yy6d9BDjjslCZ5UMZQ/giphy.webp",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnBkdGZoc3hwZzc1bG92M3dvMjh6Zmp0Yjk3NTMxOHl3OW1zdWw4aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gLWTWCg96RA0btDUm0/giphy.webp",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTA4eG5pYjAwa2xuZGNqcnE1MWdnc2xpM2tpbmFhZjBnZWo1OXhkbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3otPoO7ztAPPgdiLjG/giphy.webp",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGZzcTF4NmQ4YW1tbGRjcnRteGE1a2NwOXd0emRkZHkzczNtMGRmciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UsVPGhLAYwfLJouFDm/giphy.webp",
];

export default function Winner() {
  const router = useRouter();
  const { winner, tournamentHistory, isLoading, error } = useTournamentData();
  const triggerConfetti = useConfetti();

  useEffect(() => {
    if (winner) {
      triggerConfetti();
    }
  }, [winner, triggerConfetti]);

  // Función para obtener un GIF aleatorio (agregar antes del return)
  const getRandomGif = () => {
    const randomIndex = Math.floor(Math.random() * SOCCER_GIFS.length);
    return SOCCER_GIFS[randomIndex];
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Error
        </h1>
        <p className="mb-6 sm:mb-8 text-gray-300 text-center max-w-md">
          {error}
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 px-6 py-2 rounded-full text-sm sm:text-base"
        >
          Volver al Inicio
        </Button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-black text-white overflow-x-hidden"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent text-center"
        >
          ¡Felicidades al Ganador!
        </motion.h1>

        <WinnerCard winner={winner} winnerLogo={getRandomGif()} />

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 w-full max-w-4xl overflow-x-auto"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-white">
            Diagrama del Torneo
          </h2>
          <TournamentBracket tournamentHistory={tournamentHistory} />
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md mx-auto"
        >
          <Button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base 
      bg-zinc-800 hover:bg-zinc-700 
      text-white font-semibold
      rounded-full shadow-lg
      transform transition-all duration-300
      hover:scale-105 hover:shadow-xl
      focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
      border border-zinc-700"
          >
            Volver al Inicio
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
