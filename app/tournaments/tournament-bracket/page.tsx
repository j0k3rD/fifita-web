"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Match = {
  id: number;
  player1: string;
  player2: string;
  score1: string;
  score2: string;
  winner?: string;
  round: number;
};

export default function TournamentBracket() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [round, setRound] = useState(1);
  const [tournamentHistory, setTournamentHistory] = useState<Match[]>([]);

  useEffect(() => {
    const storedAssignments = localStorage.getItem("assignments");
    if (storedAssignments) {
      const assignments = JSON.parse(storedAssignments);
      const players = Object.keys(assignments);
      const shuffledPlayers = players.sort(() => Math.random() - 0.5);
      const initialMatches = [];
      for (let i = 0; i < shuffledPlayers.length; i += 2) {
        initialMatches.push({
          id: i / 2 + 1,
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1] || "BYE",
          score1: "",
          score2: "",
          round: 1,
        });
      }
      setMatches(initialMatches);
    }
  }, []);

  const updateScore = (
    matchId: number,
    player: "score1" | "score2",
    value: string
  ) => {
    setMatches(
      matches.map((match) =>
        match.id === matchId ? { ...match, [player]: value } : match
      )
    );
  };

  const submitResults = () => {
    const updatedMatches = matches.map((match) => {
      const score1 = parseInt(match.score1) || 0;
      const score2 = parseInt(match.score2) || 0;
      const winner = score1 > score2 ? match.player1 : match.player2;
      return { ...match, winner };
    });

    setTournamentHistory([...tournamentHistory, ...updatedMatches]);

    const winners = updatedMatches.map((match) => match.winner);

    if (winners.length > 1) {
      const newMatches = [];
      for (let i = 0; i < winners.length; i += 2) {
        newMatches.push({
          id: i / 2 + 1,
          player1: winners[i],
          player2: winners[i + 1] || "BYE",
          score1: "",
          score2: "",
          round: round + 1,
        });
      }
      setMatches(newMatches);
      setRound(round + 1);
    } else {
      localStorage.setItem(
        "tournamentHistory",
        JSON.stringify([...tournamentHistory, ...updatedMatches])
      );
      router.push("/tournaments/winner");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 animate-fade-in bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-8">
        Llaves del Torneo - Ronda {round}
      </h1>
      <div className="space-y-4 mb-8">
        {matches.map((match) => (
          <Card key={match.id} className="w-96 bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span>{match.player1}</span>
                <Input
                  className="w-16 text-center bg-gray-700 text-white border-gray-600"
                  value={match.score1}
                  onChange={(e) =>
                    updateScore(match.id, "score1", e.target.value)
                  }
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>{match.player2}</span>
                <Input
                  className="w-16 text-center bg-gray-700 text-white border-gray-600"
                  value={match.score2}
                  onChange={(e) =>
                    updateScore(match.id, "score2", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={submitResults} className="bg-blue-600 hover:bg-blue-700">
        Guardar Resultados
      </Button>
    </div>
  );
}
