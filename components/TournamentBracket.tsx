import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Match } from "@/types/types";

interface TournamentBracketProps {
  tournamentHistory: Match[];
}

export function TournamentBracket({
  tournamentHistory,
}: TournamentBracketProps) {
  const rounds = tournamentHistory.reduce((acc, match) => {
    acc[match.round] = acc[match.round] || [];
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  return (
    <div className="flex justify-start space-x-8 pb-4 overflow-x-auto">
      {Object.entries(rounds).map(([round, matches], roundIndex) => (
        <motion.div
          key={round}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 * (parseInt(round) - 1) }}
          className="flex flex-col items-center mb-8"
        >
          <h3 className="text-xl font-bold mb-4">Round {round}</h3>
          <div className="grid gap-4">
            {matches.map((match, matchIndex) => (
              <motion.div
                key={match.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * matchIndex + 0.2 * roundIndex }}
              >
                <Card className="w-64 bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors duration-300">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={
                          match.winner === match.player1
                            ? "font-bold text-green-400"
                            : ""
                        }
                      >
                        {match.player1}
                      </span>
                      <span>{match.score1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          match.winner === match.player2
                            ? "font-bold text-green-400"
                            : ""
                        }
                      >
                        {match.player2}
                      </span>
                      <span>{match.score2}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
