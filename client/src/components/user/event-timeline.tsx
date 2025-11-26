import type { Match } from "../admin/admin-dashboard"

interface EventTimelineProps {
  match: Match
}

export default function EventTimeline({ match }: EventTimelineProps) {
  const getEventIcon = (type: string) => {
    const icons = {
      goal: "⚽",
      substitution: "🔄",
      yellow_card: "🟨",
      red_card: "🟥",
      halftime: "⏸️",
      fulltime: "🏁",
    }
    return icons[type as keyof typeof icons] || "📌"
  }

  const getEventLabel = (type: string) => {
    const labels = {
      goal: "Goal",
      substitution: "Substitution",
      yellow_card: "Yellow Card",
      red_card: "Red Card",
      halftime: "Half-time",
      fulltime: "Full-time",
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <h3 className="text-2xl font-bold mb-8">Live Timeline</h3>

      {match.events.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No events yet. Stay tuned!</p>
      ) : (
        <div className="space-y-6">
          {[...match.events].reverse().map((event, index) => (
            <div key={event.id} className="flex gap-6">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                  {getEventIcon(event.type)}
                </div>
                {index < match.events.length - 1 && <div className="w-1 h-12 bg-border mt-4"></div>}
              </div>

              {/* Event details */}
              <div className="flex-1 pt-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-lg text-foreground">{getEventLabel(event.type)}</p>
                    <p className="text-sm text-muted-foreground">{event.team}</p>
                  </div>
                  <p className="font-bold text-primary text-lg">{event.minute}'</p>
                </div>

                {event.details.playerName && (
                  <p className="text-sm text-foreground bg-secondary/30 px-3 py-2 rounded inline-block">
                    {event.details.playerName}
                  </p>
                )}
                {event.details.playerOut && (
                  <p className="text-sm text-foreground bg-accent/20 px-3 py-2 rounded inline-block ml-2">
                    {event.details.playerOut} (out)
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
