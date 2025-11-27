import { useState } from "react";
import type { MatchEvent } from "./admin-dashboard";
import EventForm from "./event-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface EventManagerProps {
  LiveMatches: string;
  matchLoadingState: string;
}

export default function EventManager({ LiveMatches, matchLoadingState }: EventManagerProps) {
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const url = import.meta.env.VITE_API;
  const queryClient = useQueryClient();
  const {
    data: logMutationData,
    isPending,
    isSuccess,
    isError: mutationError,
    mutate: logEvent,
  } = useMutation({
    mutationFn: async ({
      matchId,
      event,
    }: {
      matchId: string;
      event: MatchEvent;
    }) => {
      const res = await fetch(`${url}/admin/logs/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event }),
      });

      if (!res.ok) throw new Error("Failed to log event");
      queryClient.invalidateQueries({ queryKey: [matchLoadingState] });

      return res.json();
    },
  });

  const handleAddEvent = (
    type: MatchEvent["type"],
    minute: number,
    details?: {
      team?: "teamA" | "teamB";
      player?: string;
      playerIn?: string;
      playerOut?: string;
    }
  ) => {
    if (!activeMatchId) return;

    const event: MatchEvent = {
      matchId: activeMatchId,
      type,
      minute,
      team: details?.team,
      player: details?.player,
      playerIn: details?.playerIn,
      playerOut: details?.playerOut,
    };

    logEvent({ matchId: activeMatchId, event });

    setActiveMatchId("");
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: [LiveMatches],
    queryFn: async () => {
      const response = await fetch(`${url}/matches/live`);
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error("Network error");
      }
      const data = await response.json();
      console.log(data.liveMatches);
      return data.liveMatches;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-full flex items-center justify-center">
        <p>No live matches available</p>
      </div>
    );
  }

  if (data)
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
        <h3 className="text-lg font-bold mb-2">Match Events</h3>
        {data.map((match) => (
          <div key={match.matchId}>
            <p className="text-sm text-muted-foreground mb-4">
              {match.teamA} vs {match.teamB}
            </p>

            <button
              onClick={() => setActiveMatchId(match.matchId)}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors mb-4"
            >
              + Add Event
            </button>
            {activeMatchId === match.matchId && (
              <EventForm
                match={match}
                onSubmit={handleAddEvent}
                onCancel={() => setActiveMatchId("")}
              />
            )}
          </div>
        ))}
      </div>
    );
}

{
  /* {match.status === "live" && (
          <>
            {!showEventForm ? (
              <button
                onClick={() => setShowEventForm(true)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors mb-4"
              >
                + Add Event
              </button>
            ) : (
              <div className="mb-4">
                <EventForm
                  match={match}
                  onSubmit={handleAddEvent}
                  onCancel={() => setShowEventForm(false)}
                />
              </div>
            )}
          </>
        )} */
}

{
  /* {match.status !== "live" && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Start the match to add events
          </p>
        )} */
}

{
  /* <div className="flex-1 overflow-y-auto">
          {match.events.length > 0 ? (
            <div className="space-y-2">
              {[...match.events].reverse().map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No events yet
            </p>
          )}
        </div> */
}

// function EventItem({ event }: { event: MatchEvent }) {
//   const getEventIcon = (type: string) => {
//     const icons = {
//       goal: "⚽",
//       substitution: "🔄",
//       yellow_card: "🟨",
//       red_card: "🟥",
//       halftime: "⏸️",
//       fulltime: "🏁",
//     };
//     return icons[type as keyof typeof icons] || "📌";
//   };

//   const getEventLabel = (type: string) => {
//     const labels = {
//       goal: "Goal",
//       substitution: "Substitution",
//       yellow_card: "Yellow Card",
//       red_card: "Red Card",
//       halftime: "Half-time",
//       fulltime: "Full-time",
//     };
//     return labels[type as keyof typeof labels] || type;
//   };

//   return (
//     <div className="p-3 bg-background rounded border border-border text-sm">
//       <div className="flex items-start gap-2">
//         <span className="text-lg">{getEventIcon(event.type)}</span>
//         <div className="flex-1">
//           <p className="font-bold text-foreground">
//             {getEventLabel(event.type)}
//           </p>
//           <p className="text-xs text-muted-foreground">
//             {event.minute}' - {event.team}
//           </p>
//           {event.details.playerName && (
//             <p className="text-xs text-muted-foreground mt-1">
//               {event.details.playerName}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
