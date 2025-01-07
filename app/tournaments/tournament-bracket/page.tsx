"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { readTeamsData } from "@/utils/readTeamsData";

type Match = {
  id: number;
  player1: string;
  player2: string;
  team1: string;
  team2: string;
  logo1: string;
  logo2: string;
  score1: string;
  score2: string;
  winner?: string;
  round: number;
};

type TeamsData = {
  [country: string]: {
    logo: string;
    leagues: {
      [league: string]: {
        logo: string;
        clubs: Array<{ name: string; logo: string }>;
      };
    };
  };
};

export default function TournamentBracket() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [round, setRound] = useState(1);
  const [tournamentHistory, setTournamentHistory] = useState<Match[]>([]);
  const [changeTeamsEachPhase, setChangeTeamsEachPhase] = useState(false);
  const [teamsData, setTeamsData] = useState<TeamsData | null>(null);

  useEffect(() => {
    const fetchTeamsData = async () => {
      const data = await readTeamsData();
      setTeamsData(data);
    };
    fetchTeamsData();

    const storedConfig = localStorage.getItem("tournamentConfig");
    if (storedConfig) {
      const config = JSON.parse(storedConfig);
      setChangeTeamsEachPhase(config.changeTeamsEachPhase);
    }

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
          team1: assignments[shuffledPlayers[i]].team,
          team2: assignments[shuffledPlayers[i + 1]]?.team || "BYE",
          logo1: assignments[shuffledPlayers[i]].logo,
          logo2: assignments[shuffledPlayers[i + 1]]?.logo || "bye.png",
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

  const assignNewTeam = (player: string) => {
    if (!teamsData) return { team: "Unknown", logo: "unknown.png" };

    const allTeams = Object.values(teamsData).flatMap((country) =>
      Object.values(country.leagues).flatMap((league) => league.clubs)
    );
    const randomTeam = allTeams[Math.floor(Math.random() * allTeams.length)];
    return { team: randomTeam.name, logo: randomTeam.logo };
  };

  const submitResults = () => {
    const updatedMatches = matches.map((match) => {
      const score1 = parseInt(match.score1) || 0;
      const score2 = parseInt(match.score2) || 0;
      if (score1 === score2) {
        toast({
          title: "Error",
          description:
            "Los partidos no pueden terminar empatados. Por favor, ajusta los resultados.",
          variant: "destructive",
        });
        return match;
      }
      const winner = score1 > score2 ? match.player1 : match.player2;
      return { ...match, winner };
    });

    if (updatedMatches.some((match) => !match.winner)) {
      return;
    }

    setTournamentHistory([...tournamentHistory, ...updatedMatches]);

    const winners = updatedMatches.map((match) => match.winner);

    if (winners.length > 1) {
      const newMatches = [];
      for (let i = 0; i < winners.length; i += 2) {
        const player1 = winners[i] || "BYE";
        const player2 = winners[i + 1] || "BYE";
        const team1 = changeTeamsEachPhase
          ? assignNewTeam(player1 || "BYE")
          : { team: updatedMatches[i].team1, logo: updatedMatches[i].logo1 };
        const team2 =
          player2 !== "BYE" && changeTeamsEachPhase
            ? assignNewTeam(player2)
            : { team: updatedMatches[i].team2, logo: updatedMatches[i].logo2 };
        newMatches.push({
          id: i / 2 + 1,
          player1,
          player2,
          team1: team1.team,
          team2: team2.team,
          logo1: team1.logo,
          logo2: team2.logo,
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
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Image
                    src={`/images/teams/${match.logo1}`}
                    alt={match.team1}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span>
                    {match.player1} ({match.team1})
                  </span>
                </div>
                <Input
                  className="w-16 text-center bg-gray-700 text-white border-gray-600"
                  value={match.score1}
                  onChange={(e) =>
                    updateScore(match.id, "score1", e.target.value)
                  }
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <Image
                    src={`/images/teams/${match.logo2}`}
                    alt={match.team2}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span>
                    {match.player2} ({match.team2})
                  </span>
                </div>
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
