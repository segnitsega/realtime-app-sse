import type { Match } from "../admin/admin-dashboard"
import EventTimeline from "./event-timeline"

interface MatchDetailsProps {
  match: Match
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  return (
    <div className="space-y-">
      {/* Score Card */}
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="grid grid-cols-3 gap-8 items-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Team A</p>
            <p className="text-4xl font-bold text-foreground">{match.teamA}</p>
          </div>

          <div className="text-center border-l border-r border-border py-6">
            <div className="text-6xl font-bold text-primary mb-2">
              {match.scoreA} - {match.scoreB}
            </div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                match.status === "live" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${match.status === "live" ? "animate-pulse" : ""}`}
                style={{ backgroundColor: "currentColor" }}
              ></span>
              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Team B</p>
            <p className="text-4xl font-bold text-foreground">{match.teamB}</p>
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <EventTimeline match={match} />
    </div>
  )
}
