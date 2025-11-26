import type React from "react"

interface MatchEvent {
  id: string
  type: "goal" | "card" | "foul"
  player: string
  timestamp: number
  team: "A" | "B"
  details?: string
}

interface MatchDetailPageProps {
  teamA: string
  teamB: string
  scoreA: number
  scoreB: number
  events: MatchEvent[]
  onBack: () => void
}

const getEventIcon = (type: MatchEvent["type"]) => {
  switch (type) {
    case "goal":
      return "⚽"
    case "card":
      return "🟨"
    case "foul":
      return "⚠️"
    default:
      return "•"
  }
}

const getEventColor = (type: MatchEvent["type"]) => {
  switch (type) {
    case "goal":
      return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900"
    case "card":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900"
    case "foul":
      return "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-900"
    default:
      return "bg-muted border-border"
  }
}

export const MatchDetailPage: React.FC<MatchDetailPageProps> = ({ teamA, teamB, scoreA, scoreB, events, onBack }) => {
  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-background">
      <button
        onClick={onBack}
        className="mb-6 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to Matches
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Match Details</h1>

        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex-1 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-3">{teamA}</p>
              <div className="bg-muted rounded-lg px-6 py-4">
                <p className="text-4xl font-bold text-foreground">{scoreA}</p>
              </div>
            </div>

            <div className="text-muted-foreground font-light text-xl">vs</div>

            <div className="flex-1 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-3">{teamB}</p>
              <div className="bg-muted rounded-lg px-6 py-4">
                <p className="text-4xl font-bold text-foreground">{scoreB}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-border"></div>

          <div className="mt-6 text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Live</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Match Events</h2>

        <div className="space-y-3">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events yet</p>
            </div>
          ) : (
            sortedEvents.map((event) => (
              <div key={event.id} className={`p-4 border rounded-lg ${getEventColor(event.type)}`}>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getEventIcon(event.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground">{event.player}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.team === "A" ? teamA : teamB}</p>
                    {event.details && <p className="text-sm text-muted-foreground mt-2">{event.details}</p>}
                    <p className="text-xs text-muted-foreground mt-2">{event.timestamp}'</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
