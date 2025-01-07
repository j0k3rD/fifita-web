import { useState, useEffect } from "react";
import { Match } from "@/types/types";

export function useTournamentData() {
  const [winner, setWinner] = useState<string>("");
  const [winnerLogo, setWinnerLogo] = useState<string>("");
  const [tournamentHistory, setTournamentHistory] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const history = JSON.parse(
        localStorage.getItem("tournamentHistory") || "[]"
      );
      const assignments = JSON.parse(
        localStorage.getItem("assignments") || "{}"
      );

      if (history.length > 0) {
        setTournamentHistory(history);
        const lastMatch = history[history.length - 1];
        setWinner(lastMatch.winner || "");
        setWinnerLogo(assignments[lastMatch.winner]?.logo || "");
      } else {
        throw new Error("No tournament history found");
      }
    } catch (err) {
      setError("Failed to load tournament data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { winner, winnerLogo, tournamentHistory, isLoading, error };
}
