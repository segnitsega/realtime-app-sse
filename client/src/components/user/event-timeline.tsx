import { useEffect, useState } from "react";
import type { Match, MatchEvent } from "../admin/admin-dashboard";
import { useQuery } from "@tanstack/react-query";

interface EventTimelineProps {
  match: Match;
}

export default function EventTimeline({ match }: EventTimelineProps) {
  const url = import.meta.env.VITE_API;

  const getEventIcon = (type: string) => {
    const icons = {
      goal: "⚽",
      substitution: "🔄",
      "yellow-card": "🟨",
      "red-card": "🟥",
      "half-time": "⏸️",
      "full-time": "🏁",
    };
    return icons[type as keyof typeof icons];
  };
// || "📌";
  const getEventLabel = (type: string) => {
    const labels = {
      goal: "Goal",
      substitution: "Substitution",
      "yellow-card": "Yellow Card",
      "red-card": "Red Card",
      "half-time": "Half-time",
      "full-time": "Full-time",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const [events, setEvents] = useState<MatchEvent[]>([]);
  const { data: matchData, isLoading } = useQuery({
    queryKey: ["match-events", match.matchId],
    queryFn: async () => {
      const res = await fetch(`${url}/matches/${match.matchId}`);
      if (!res.ok) throw new Error("Failed to fetch match events");
      return res.json();
    },
  });

  useEffect(() => {
    if (matchData?.events) {
      const formattedEvents = matchData.events.map((ev, i) => ({
        id: i + 1,
        ...ev,
        time: "", // no timestamp for stored events
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEvents(formattedEvents);
    }
  }, [matchData]);
  
  useEffect(() => {
    const es = new EventSource(`${url}/events`);

    es.onmessage = (event) => {
      try {
        const parsed: MatchEvent = JSON.parse(event.data);
        console.log(`event: ${parsed}`)
        setEvents((prev) => [...prev, parsed]);
      } catch (err) {
        console.error("Invalid SSE event:", err);
      }
    };

    es.onerror = () => {
      console.log("SSE closed");
      es.close();
    };

    return () => es.close();
  }, []);

  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      {events.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          Waiting for live events...
        </p>
      )}

      {events.map((event, index) => {
        const isTeamA = event.team === "teamA";

        return (
          <div
            key={index}
            className={`flex w-full ${
              isTeamA ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-xl px-20 py-1 shadow 
              ${
                isTeamA ? "bg-secondary text-left" : "bg-primary/20 text-right"
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-2">
                <span className="text-xl">{getEventIcon(event.type)}</span>
                <span className="font-semibold">
                  {getEventLabel(event.type)}
                </span>
              </div>

              {/* Details */}
              <p className="text-sm text-muted-foreground mt-1">
                {event.player ||
                  `${event.playerOut || ""} → ${event.playerIn || ""}`}
              </p>

              {/* Minute */}
              <p className="text-xs text-foreground mt-1 font-medium">
                {event.minute}'
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
