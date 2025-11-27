import type { Match } from "./admin-dashboard"

interface MatchListProps {
  matches: Match[]
  onSelectMatch: (id: string) => void
  onStartMatch: (id: string) => void
}

export default function MatchList({ matches, onSelectMatch, onStartMatch }: MatchListProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      scheduled: "bg-muted text-muted-foreground",
      live: "bg-accent text-accent-foreground",
      halftime: "bg-secondary text-secondary-foreground",
      ended: "bg-secondary text-secondary-foreground",
    }
    return styles[status as keyof typeof styles] || styles.scheduled
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <div
          key={match.matchId}
          onClick={() => onSelectMatch(match.matchId)}
          className={`p-4 rounded-lg border cursor-pointer transition-all bg-card border-border hover:border-primary/50"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p className="font-bold text-foreground">
                {match.teamA} vs {match.teamB}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{new Date(match.startTime).toLocaleString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(match.status)}`}>
              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex-1 flex justify-around">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{match.scoreA}</p>
                <p className="text-xs text-muted-foreground">{match.teamA}</p>
              </div>
              <p className="text-muted-foreground font-bold">-</p>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{match.scoreB}</p>
                <p className="text-xs text-muted-foreground">{match.teamB}</p>
              </div>
            </div>
          </div>

          {(match.status === "not-started" || match.status === "half-time")  && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onStartMatch(match.matchId)
              }}
              className="w-full mt-3 px-3 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Match
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
