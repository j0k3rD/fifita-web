"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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

type NewTournamentFormProps = {
  teamsData: TeamsData;
};

export default function NewTournamentForm({
  teamsData,
}: NewTournamentFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [teamSelection, setTeamSelection] = useState("all");
  const [changeTeams, setChangeTeams] = useState(false);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para crear el torneo en la base de datos
    console.log({ name, teamSelection, changeTeams, selectedLeagues });
    localStorage.setItem(
      "tournamentConfig",
      JSON.stringify({ name, teamSelection, changeTeams, selectedLeagues })
    );
    router.push("/tournaments/add-participants");
  };

  const toggleLeague = (league: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(league)
        ? prev.filter((l) => l !== league)
        : [...prev, league]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Torneo</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamSelection">Selección de Equipos</Label>
        <Select value={teamSelection} onValueChange={setTeamSelection}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los equipos de FC25</SelectItem>
            <SelectItem value="leagues">
              Seleccionar ligas específicas
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {teamSelection === "leagues" && (
        <div className="space-y-2">
          <Label>Ligas Disponibles</Label>
          <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
            {Object.entries(teamsData).map(([country, countryData]) =>
              Object.keys(countryData.leagues).map((league) => (
                <Card key={`${country}-${league}`} className="p-2">
                  <CardContent className="flex items-center space-x-2">
                    <Checkbox
                      id={`${country}-${league}`}
                      checked={selectedLeagues.includes(`${country}-${league}`)}
                      onCheckedChange={() =>
                        toggleLeague(`${country}-${league}`)
                      }
                    />
                    <Label htmlFor={`${country}-${league}`}>{league}</Label>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Switch
          id="changeTeams"
          checked={changeTeams}
          onCheckedChange={setChangeTeams}
        />
        <Label htmlFor="changeTeams">Cambiar equipos en cada fase</Label>
      </div>
      <Button type="submit" className="w-full">
        Crear Torneo
      </Button>
    </form>
  );
}
