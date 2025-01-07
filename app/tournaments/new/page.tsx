import { readTeamsData } from "@/utils/readTeamsData";
import { NewTournamentForm } from "@/components/NewTournamentForm";

export default function NewTournament() {
  const teamsData = readTeamsData();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 animate-fade-in bg-black text-white">
      <h1 className="text-3xl font-bold mb-8">Crear Nuevo Torneo</h1>
      <NewTournamentForm teamsData={teamsData} />
    </div>
  );
}
