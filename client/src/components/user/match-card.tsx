import type { Match } from "../admin/admin-dashboard"

interface MatchCardProps {
  match: Match
  onClick: () => void
}

export default function MatchCard({ match, onClick }: MatchCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{new Date(match.startTime).toLocaleString()}</p>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
              match.status === "live"
                ? "bg-accent text-accent-foreground animate-pulse"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            <span className="w-2 h-2 bg-current rounded-full"></span>
            {match.status.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-bold text-lg text-foreground">{match.teamA}</p>
          </div>
          <div className="text-center mx-4">
            <p className="text-3xl font-bold text-primary">{match.scoreA}</p>
          </div>
        </div>

        <div className="text-center text-muted-foreground text-sm">vs</div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-bold text-lg text-foreground">{match.teamB}</p>
          </div>
          <div className="text-center mx-4">
            <p className="text-3xl font-bold text-primary">{match.scoreB}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-primary font-bold hover:underline">View Details →</p>
      </div>
    </div>
  )
}
