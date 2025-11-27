import { useState, useEffect } from "react";
import MatchList from "./match-list";
import MatchForm from "./match-form";
import EventManager from "./event-manager";
import spinner from "../../assets/spinner-loading.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Match {
  matchId: string;
  teamA: string;
  teamB: string;
  startTime: string;
  status: "not-started" | "live" | "ended" | "half-time";
  scoreA: number;
  scoreB: number;
  events: MatchEvent[];
}

export interface MatchEvent {
  matchId: string;
  type:
    | "goal"
    | "substitution"
    | "yellow-card"
    | "red-card"
    | "half-time"
    | "match-end";
  team?: "teamA" | "teamB";
  player?: string;
  playerIn?: string;
  playerOut?: string;
  minute: number;
}

export default function AdminDashboard() {
  const url = import.meta.env.VITE_API;
  const liveMatchLoadingState = "live-matches";
  const [matches, setMatches] = useState<Match[]>([]);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const queryClient = useQueryClient();
  //  {
  //       id: "1",
  //       teamA: "Manchester United",
  //       teamB: "Liverpool",
  //       startTime: "2025-11-26T15:00",
  //       status: "not-started",
  //       scoreA: 0,
  //       scoreB: 0,
  //       events: [],
  //     },

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


  const createMatchMutation = useMutation({
    mutationFn: async ({ teamA, teamB, startTime }: { teamA: string; teamB: string, startTime: string }) => {
      const res = await fetch(`${url}/admin/create-match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamA, teamB, startTime }),
      });

      if (!res.ok) {
        throw new Error("Failed to create match");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },

    onError: (error) => {
      console.error("Create match error:", error);
    },
  });

  const startMatchMutation = useMutation({
    mutationFn: async (matchId: string) => {
      const res = await fetch(`${url}/admin/start-match/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to start match");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: [liveMatchLoadingState] });
    },

    onError: (error) => {
      console.error("Start match error:", error);
    },
  });

  const addMatch = (teamA: string, teamB: string, startTime: string) => {
    // const newMatch: Match = {
    //   matchId: Date.now().toString(),
    //   teamA,
    //   teamB,
    //   startTime,
    //   status: "not-started",
    //   scoreA: 0,
    //   scoreB: 0,
    //   events: [],
    // };
    // setMatches([...matches, newMatch]);
    createMatchMutation.mutate({ teamA, teamB, startTime });
  };

  const startMatch = (matchId: string) => {
    startMatchMutation.mutate(matchId);
  };

  const addEvent = (matchId: string, event: MatchEvent) => {
    setMatches(
      matches.map((m) =>
        m.matchId === matchId
          ? {
              ...m,
              events: [...m.events, event],
              scoreA:
                event.type === "goal" && event.team === m.teamA
                  ? m.scoreA + 1
                  : m.scoreA,
              scoreB:
                event.type === "goal" && event.team === m.teamB
                  ? m.scoreB + 1
                  : m.scoreB,
            }
          : m
      )
    );
  };

  //   const selectedMatch = matches.find((m) => m.matchId === selectedMatchId);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h2>
        <p className="text-muted-foreground">
          Manage football matches and live events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Match List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Matches</h3>
            <button
              onClick={() => setShowMatchForm(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              + New Match
            </button>
          </div>

          {showMatchForm && (
            <MatchForm
              onSubmit={addMatch}
              onCancel={() => setShowMatchForm(false)}
            />
          )}

          {isLoading && (
            <div className="flex justify-center items-center min-h-screen">
              <img src={spinner} alt="Loading..." className="w-16 h-16" />
            </div>
          )}
          { (isError || data?.length === 0) && (
            <div className="flex justify-center items-center min-h-screen">
              <p className="text-red-500 text-lg">
                No Matches found. Create New Matches.
              </p>
            </div>
          )}

          {data && data.length > 0 && (
            <MatchList
              matches={data}
              selectedMatchId={`${data[0].matchId}`}
              onSelectMatch={(id: string) => {}}
              onStartMatch={startMatch}
            />
          )}
        </div>

        {/* Right Panel - Event Manager */}
          <EventManager LiveMatches={liveMatchLoadingState}/>

        {/* {liveMatchData && liveMatchData.length > 0 && (
          <div>
            {liveMatchData[0].matchId ? (
              <EventManager match={liveMatchData[0]} onAddEvent={addEvent} />
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  Select a match to manage events
                </p>
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
}
