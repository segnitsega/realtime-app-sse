import { useState } from "react";
import MatchCard from "./match-card";
import MatchDetails from "./match-details";
import type { Match } from "../admin/admin-dashboard";
import { useQuery } from "@tanstack/react-query";

export default function UserViewer() {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const url = import.meta.env.VITE_API;

  // Mock data - would be fetched from backend in real app
  const [liveMatches] = useState<Match[]>([
    {
      id: "1",
      teamA: "Manchester United",
      teamB: "Liverpool",
      startTime: "2025-11-26T15:00",
      status: "live",
      scoreA: 2,
      scoreB: 1,
      events: [
        {
          id: "1",
          type: "goal",
          team: "Manchester United",
          minute: 12,
          details: { playerName: "Harry Maguire" },
        },
        {
          id: "2",
          type: "goal",
          team: "Liverpool",
          minute: 28,
          details: { playerName: "Mohamed Salah" },
        },
        {
          id: "3",
          type: "goal",
          team: "Manchester United",
          minute: 45,
          details: { playerName: "Bruno Fernandes" },
        },
      ],
    },
    {
      id: "2",
      teamA: "Chelsea",
      teamB: "Arsenal",
      startTime: "2025-11-26T17:30",
      status: "scheduled",
      scoreA: 0,
      scoreB: 0,
      events: [],
    },
  ]);

  const { data, isLoading, isError } = useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      const response = await fetch(`${url}/matches`);
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error("Network error");
      }
      return response.json();
    },
  });
  const selectedMatch = data?.find((m) => m.matchId === selectedMatchId);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-8">
          <h1 className="text-4xl font-bold text-balance">Live Matches</h1>
          <p className="text-primary-foreground/80 mt-2">
            Watch real-time match updates
          </p>
        </div>

        <div className="p-8">
          {selectedMatch ? (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedMatchId(null)}
                className="px-4 py-2 text-primary font-bold hover:underline text-sm"
              >
                ← Back to Matches
              </button>
              <MatchDetails match={selectedMatch} />
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Currently Live</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.map((match) => (
                  <MatchCard
                    key={match.matchId}
                    match={match}
                    onClick={() => setSelectedMatchId(match.matchId)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
