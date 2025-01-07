import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface WinnerCardProps {
  winner: string;
  winnerLogo: string; // Ahora será la URL del GIF de GIPHY
}

export function WinnerCard({ winner, winnerLogo }: WinnerCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700 mb-8 overflow-hidden">
        <CardContent className="p-6 flex flex-col items-center">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold mb-4 text-center"
          >
            {winner}
          </motion.h2>
          {winnerLogo && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.7,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src={winnerLogo}
                alt={`Celebración de ${winner}`}
                width={300}
                height={300}
                className="object-cover"
                unoptimized // Necesario para GIFs externos
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
