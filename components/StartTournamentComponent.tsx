"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

type Assignment = {
  team: string;
  logo: string;
};

type StartTournamentComponentProps = {
  teamsData: TeamsData;
};

export default function StartTournamentComponent({
  teamsData,
}: StartTournamentComponentProps) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<{ [key: string]: Assignment }>(
    {}
  );
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    const storedParticipants = localStorage.getItem("participants");
    const tournamentConfig = JSON.parse(
      localStorage.getItem("tournamentConfig") || "{}"
    );
    if (storedParticipants) {
      setParticipants(JSON.parse(storedParticipants));
    }
    assignTeams(JSON.parse(storedParticipants || "[]"), tournamentConfig);
  }, []);

  const assignTeams = (participants: string[], config: any) => {
    let allTeams: Array<{ name: string; logo: string }> = [];

    if (config.teamSelection === "all") {
      allTeams = Object.values(teamsData).flatMap((country) =>
        Object.values(country.leagues).flatMap((league) => league.clubs)
      );
    } else {
      allTeams = config.selectedLeagues.flatMap((leagueKey: string) => {
        const [country, league] = leagueKey.split("-");
        return teamsData[country].leagues[league].clubs;
      });
    }

    const shuffledTeams = [...allTeams].sort(() => Math.random() - 0.5);
    const newAssignments: { [key: string]: Assignment } = {};
    participants.forEach((participant, index) => {
      const team = shuffledTeams[index % shuffledTeams.length];
      newAssignments[participant] = { team: team.name, logo: team.logo };
    });
    setAssignments(newAssignments);
  };

  const handleStart = () => {
    console.log("Torneo iniciado con asignaciones:", assignments);
    localStorage.setItem("assignments", JSON.stringify(assignments));
    router.push("/tournaments/tournament-bracket");
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(assignments).map(([participant, assignment]) => (
          <Card key={participant} className="w-full overflow-hidden">
            <CardContent className="p-6 relative">
              <div
                className="absolute inset-0 bg-cover bg-center z-0 filter blur-sm opacity-50 transition-all duration-300 ease-in-out hover:blur-none hover:opacity-75"
                style={{ backgroundImage: `url(/logos/${assignment.logo})` }}
              />
              <div className="relative z-10">
                <h2 className="font-bold text-xl mb-2">{participant}</h2>
                <p className="text-lg">{assignment.team}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={handleStart} className="w-full">
        Iniciar Torneo
      </Button>
    </div>
  );
}
