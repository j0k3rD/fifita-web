"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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

interface Team {
  team: string;
  logo: string;
}

interface Assignments {
  [participant: string]: Team;
}

export default function StartTournamentComponent({
  teamsData,
}: StartTournamentComponentProps) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<{ [key: string]: Assignment }>(
    {}
  );
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const assignTeams = useCallback(() => {
    let allTeams: Array<{ name: string; logo: string }> = [];

    const tournamentConfig = JSON.parse(
      localStorage.getItem("tournamentConfig") || "{}"
    );
    const storedParticipants = localStorage.getItem("participants");

    if (tournamentConfig.teamSelection === "all") {
      allTeams = Object.values(teamsData).flatMap((country) =>
        Object.values(country.leagues).flatMap((league) => league.clubs)
      );
    } else {
      allTeams = tournamentConfig.selectedLeagues.flatMap(
        (leagueKey: string) => {
          const [country, league] = leagueKey.split("-");
          return teamsData[country].leagues[league].clubs;
        }
      );
    }

    const shuffledTeams = [...allTeams].sort(() => Math.random() - 0.5);
    const newAssignments: { [key: string]: Assignment } = {};
    JSON.parse(storedParticipants || "[]").forEach(
      (participant: string, index: number) => {
        const team = shuffledTeams[index % shuffledTeams.length];
        newAssignments[participant] = { team: team.name, logo: team.logo };
      }
    );
    setAssignments(newAssignments);
  }, [teamsData]);

  useEffect(() => {
    assignTeams();
  }, [assignTeams]);

  const handleStart = () => {
    console.log("Torneo iniciado con asignaciones:", assignments);
    localStorage.setItem("assignments", JSON.stringify(assignments));
    router.push("/tournaments/tournament-bracket");
  };

  return (
    <div className="w-full max-w-4xl p-8 bg-black text-white">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {Object.entries(assignments as Assignments).map(
          ([participant, assignment], index) => (
            <motion.div
              key={participant}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="w-full overflow-hidden bg-white text-black"
                onMouseEnter={() => setHoveredCard(participant)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-6 relative h-48">
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                      backgroundImage: `url(/images/teams/${assignment.logo})`,
                    }}
                    initial={{ opacity: 0.3, filter: "blur(4px)" }}
                    animate={{
                      opacity: hoveredCard === participant ? 1 : 0.3,
                      filter:
                        hoveredCard === participant ? "blur(0px)" : "blur(4px)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="relative z-10 h-full flex flex-col justify-between"
                    initial={{ y: 0 }}
                    animate={{ y: hoveredCard === participant ? -10 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-bold text-2xl mb-2">{participant}</h2>
                    <p className="text-lg font-semibold">{assignment.team}</p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          onClick={handleStart}
          className="w-full bg-white text-black hover:bg-gray-200 transition-colors duration-300"
        >
          Iniciar Torneo
        </Button>
      </motion.div>
    </div>
  );
}
