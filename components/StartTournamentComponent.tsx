"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

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

interface Assignments {
  [participant: string]: Assignment;
}

export default function StartTournamentComponent({
  teamsData,
}: StartTournamentComponentProps) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignments>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(true);

  const assignTeams = useCallback(() => {
    setIsAssigning(true);
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
    const newAssignments: Assignments = {};
    JSON.parse(storedParticipants || "[]").forEach(
      (participant: string, index: number) => {
        const team = shuffledTeams[index % shuffledTeams.length];
        newAssignments[participant] = { team: team.name, logo: team.logo };
      }
    );

    // Simulate a delay for the assignment process
    setTimeout(() => {
      setAssignments(newAssignments);
      setIsAssigning(false);
    }, 1500);
  }, [teamsData]);

  useEffect(() => {
    assignTeams();
  }, [assignTeams]);

  const handleStart = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    console.log("Torneo iniciado con asignaciones:", assignments);
    localStorage.setItem("assignments", JSON.stringify(assignments));
    toast({
      title: "¡Torneo iniciado!",
      description: "Las asignaciones de equipos han sido guardadas.",
    });
    router.push("/tournaments/tournament-bracket");
  };

  return (
    <div className="w-full max-w-4xl p-4 sm:p-8 bg-black/50 rounded-lg shadow-lg">
      <AnimatePresence mode="wait">
        {isAssigning ? (
          <motion.div
            key="assigning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64"
          >
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
            <p className="text-lg">Asignando equipos...</p>
          </motion.div>
        ) : (
          <motion.div
            key="assigned"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {Object.entries(assignments).map(
                ([participant, assignment], index) => (
                  <motion.div
                    key={participant}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Card
                      className="w-full overflow-hidden bg-white/10 backdrop-blur-lg text-white border-white/20"
                      onMouseEnter={() => setHoveredCard(participant)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <CardContent className="p-6 relative h-48">
                        <motion.div
                          className="absolute inset-0 bg-cover bg-center z-0"
                          style={{
                            backgroundImage: `url(/images/teams/${assignment.logo})`,
                          }}
                          initial={{
                            opacity: 0.3,
                            filter: "blur(4px)",
                            scale: 1,
                          }}
                          animate={{
                            opacity: hoveredCard === participant ? 0.7 : 0.3,
                            filter:
                              hoveredCard === participant
                                ? "blur(0px)"
                                : "blur(4px)",
                            scale: hoveredCard === participant ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.div
                          className="relative z-10 h-full flex flex-col justify-between"
                          initial={{ y: 0 }}
                          animate={{ y: hoveredCard === participant ? -10 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h2 className="font-bold text-2xl mb-2">
                            {participant}
                          </h2>
                          <p className="text-lg font-semibold">
                            {assignment.team}
                          </p>
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
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Iniciar Torneo
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
