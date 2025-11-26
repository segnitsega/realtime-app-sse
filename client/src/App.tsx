import { useState } from "react"
import { MatchListPage } from "./components/match-list-page"
import { MatchDetailPage } from "./components/match-detail-page"
import { AdminPanel } from "./components/admin-panel"

interface Match {
  id: string
  teamA: string
  teamB: string
  scoreA: number
  scoreB: number
}

interface MatchEvent {
  id: string
  type: "goal" | "card" | "foul"
  player: string
  timestamp: number
  team: "A" | "B"
  details?: string
}

export default function App() {
  const [view, setView] = useState<"list" | "detail" | "admin">("admin")
  const [matches, setMatches] = useState<Match[]>([
    {
      id: "match-1",
      teamA: "Manchester United",
      teamB: "Liverpool",
      scoreA: 2,
      scoreB: 1,
    },
    {
      id: "match-2",
      teamA: "Arsenal",
      teamB: "Chelsea",
      scoreA: 1,
      scoreB: 1,
    },
  ])
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>("match-1")
  const [events, setEvents] = useState<MatchEvent[]>([
    {
      id: "event-1",
      type: "goal",
      player: "Bruno Fernandes",
      timestamp: 12,
      team: "A",
    },
    {
      id: "event-2",
      type: "foul",
      player: "Mohamed Salah",
      timestamp: 18,
      team: "B",
      details: "Yellow card for excessive celebration",
    },
    {
      id: "event-3",
      type: "goal",
      player: "Mohamed Salah",
      timestamp: 34,
      team: "B",
    },
    {
      id: "event-4",
      type: "goal",
      player: "Marcus Rashford",
      timestamp: 45,
      team: "A",
    },
  ])

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId)
    setView("detail")
  }

  const handleBack = () => {
    setView("list")
  }

  const selectedMatch = matches.find((m) => m.id === selectedMatchId)

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <div className="flex gap-2 mb-8 px-6">
          <button
            onClick={() => setView("admin")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              view === "admin" ? "bg-red-500 text-white" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              view === "list" ? "bg-red-500 text-white" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Matches
          </button>
        </div>

        {/* Views */}
        {view === "admin" && (
          <AdminPanel
            onMatchCreate={(teamA, teamB) => {
              const newMatch: Match = {
                id: `match-${Date.now()}`,
                teamA,
                teamB,
                scoreA: 0,
                scoreB: 0,
              }
              setMatches([...matches, newMatch])
            }}
            onMatchStart={(matchId) => {
              setSelectedMatchId(matchId)
              setView("list")
            }}
          />
        )}

        {view === "list" && <MatchListPage matches={matches} onSelectMatch={handleSelectMatch} />}

        {view === "detail" && selectedMatch && (
          <MatchDetailPage
            teamA={selectedMatch.teamA}
            teamB={selectedMatch.teamB}
            scoreA={selectedMatch.scoreA}
            scoreB={selectedMatch.scoreB}
            events={events}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}
