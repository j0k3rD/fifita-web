import { readTeamsData } from "@/utils/readTeamsData";
import StartTournamentComponent from "@/components/StartTournamentComponent";

export default function StartTournament() {
  const teamsData = readTeamsData();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 animate-fade-in bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-8">Asignación de Equipos</h1>
      <StartTournamentComponent teamsData={teamsData} />
    </div>
  );
}
