"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { readTeamsData } from "@/utils/readTeamsData";
import StartTournamentComponent from "@/components/StartTournamentComponent";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function StartTournament() {
  const [teamsData, setTeamsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readTeamsData();
        setTeamsData(data);
      } catch (error) {
        console.error("Error fetching teams data:", error);
        toast({
          title: "Error",
          description:
            "No se pudieron cargar los datos de los equipos. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-black text-white">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Asignación de Equipos
      </motion.h1>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Cargando datos de equipos...</span>
        </div>
      ) : teamsData ? (
        <StartTournamentComponent teamsData={teamsData} />
      ) : (
        <div className="text-center text-red-500">
          Error al cargar los datos de equipos. Por favor, intenta de nuevo.
        </div>
      )}
    </div>
  );
}
