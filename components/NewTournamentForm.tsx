"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { teamsData } from "@/data/fc25_teams";

interface NewTournamentFormProps {
  teamsData: {
    [country: string]: {
      logo: string;

      leagues: {
        [leagueName: string]: {
          logo: string;

          clubs: { name: string; logo: string }[];
        };
      };
    };
  };
}

export function NewTournamentForm({ teamsData }: NewTournamentFormProps) {
  const [tournamentName, setTournamentName] = useState("");
  const [teamSelection, setTeamSelection] = useState<"all" | "select">("all");
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [changeTeamsEachPhase, setChangeTeamsEachPhase] =
    useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tournamentName.trim()) {
      const tournamentConfig = {
        tournamentName,
        teamSelection,
        selectedLeagues,
        changeTeamsEachPhase,
      };
      localStorage.setItem(
        "tournamentConfig",
        JSON.stringify(tournamentConfig)
      );
      router.push("/tournaments/start");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="tournamentName">Nombre del Torneo</Label>
        <Input
          id="tournamentName"
          type="text"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label>Selección de Equipos</Label>
        <RadioGroup
          value={teamSelection}
          onValueChange={(value) => setTeamSelection(value as "all" | "select")}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">Todos los equipos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="select" id="select" />
            <Label htmlFor="select">Seleccionar ligas</Label>
          </div>
        </RadioGroup>
      </div>

      {teamSelection === "select" && teamsData && (
        <div className="space-y-2">
          <Label>Ligas Disponibles</Label>
          {Object.entries(teamsData).map(([country, countryData]) =>
            Object.keys(countryData.leagues).map((league) => (
              <div
                key={`${country}-${league}`}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`${country}-${league}`}
                  checked={selectedLeagues.includes(`${country}-${league}`)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedLeagues([
                        ...selectedLeagues,
                        `${country}-${league}`,
                      ]);
                    } else {
                      setSelectedLeagues(
                        selectedLeagues.filter(
                          (l) => l !== `${country}-${league}`
                        )
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`${country}-${league}`}
                >{`${country} - ${league}`}</Label>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="changeTeams"
          checked={changeTeamsEachPhase}
          onCheckedChange={(checked) =>
            setChangeTeamsEachPhase(checked as boolean)
          }
        />
        <Label htmlFor="changeTeams">
          Cambiar equipos después de cada fase
        </Label>
      </div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button type="submit" className="w-full">
          Crear Torneo
        </Button>
      </motion.div>
    </form>
  );
}
