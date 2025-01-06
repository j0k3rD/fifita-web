"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "./confetti.css";

type Match = {
  id: number;
  player1: string;
  player2: string;
  score1: string;
  score2: string;
  winner?: string;
  round: number;
};

export default function Winner() {
  const router = useRouter();
  const [winner, setWinner] = useState<string>("");
  const [winnerLogo, setWinnerLogo] = useState<string>("");
  const [tournamentHistory, setTournamentHistory] = useState<Match[]>([]);

  useEffect(() => {
    const history = JSON.parse(
      localStorage.getItem("tournamentHistory") || "[]"
    );
    const assignments = JSON.parse(localStorage.getItem("assignments") || "{}");

    if (history.length > 0) {
      setTournamentHistory(history);
      const lastMatch = history[history.length - 1];
      setWinner(lastMatch.winner || "");
      setWinnerLogo(assignments[lastMatch.winner]?.logo || "");
    }
  }, []);

  const renderConfetti = () => {
    return Array.from({ length: 50 }).map((_, index) => (
      <div
        key={index}
        className="confetti"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        }}
      />
    ));
  };

  const renderBracket = () => {
    const rounds = tournamentHistory.reduce((acc, match) => {
      acc[match.round] = acc[match.round] || [];
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, Match[]>);

    return Object.entries(rounds).map(([round, matches]) => (
      <div key={round} className="flex flex-col items-center mb-8">
        <h3 className="text-xl font-bold mb-4">Round {round}</h3>
        <div className="grid gap-4">
          {matches.map((match) => (
            <Card key={match.id} className="w-64 bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={
                      match.winner === match.player1 ? "font-bold" : ""
                    }
                  >
                    {match.player1}
                  </span>
                  <span>{match.score1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={
                      match.winner === match.player2 ? "font-bold" : ""
                    }
                  >
                    {match.player2}
                  </span>
                  <span>{match.score2}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 animate-fade-in bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-x-hidden">
      {renderConfetti()}
      <h1 className="text-4xl font-bold mb-8">¡Felicidades al Ganador!</h1>
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 mb-8">
        <CardContent className="p-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">{winner}</h2>
          {winnerLogo && (
            <Image
              src={`/logos/${winnerLogo}`}
              alt={`Logo de ${winner}`}
              width={200}
              height={200}
              className="mb-4"
            />
          )}
        </CardContent>
      </Card>
      <div className="mb-8 w-full max-w-4xl overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Diagrama del Torneo
        </h2>
        <div className="flex justify-start space-x-8 pb-4">
          {renderBracket()}
        </div>
      </div>
      <Button
        onClick={() => router.push("/")}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Volver al Inicio
      </Button>
    </div>
  );
}
