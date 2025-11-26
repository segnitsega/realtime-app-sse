import type React from "react"
import { useState } from "react"

interface CreatedMatch {
  id: string
  teamA: string
  teamB: string
  status: "created" | "started"
}

interface AdminPanelProps {
  onMatchCreate?: (teamA: string, teamB: string) => void
  onMatchStart?: (matchId: string) => void
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onMatchCreate, onMatchStart }) => {
  const [teamA, setTeamA] = useState("")
  const [teamB, setTeamB] = useState("")
  const [matches, setMatches] = useState<CreatedMatch[]>([])
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)

  const handleCreateMatch = () => {
    if (teamA.trim() && teamB.trim()) {
      const newMatch: CreatedMatch = {
        id: `match-${Date.now()}`,
        teamA: teamA.trim(),
        teamB: teamB.trim(),
        status: "created",
      }
      setMatches([...matches, newMatch])
      onMatchCreate?.(teamA, teamB)
      setTeamA("")
      setTeamB("")
      setSelectedMatchId(newMatch.id)
    }
  }

  const handleStartMatch = () => {
    if (selectedMatchId) {
      setMatches(matches.map((match) => (match.id === selectedMatchId ? { ...match, status: "started" } : match)))
      onMatchStart?.(selectedMatchId)
      setSelectedMatchId(null)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-background">
      <h1 className="text-2xl font-semibold text-foreground mb-8">Admin Panel</h1>

      <div className="space-y-6">
        {/* Create Match Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Create New Match</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Team A</label>
              <input
                type="text"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                placeholder="Enter team A name"
                className="w-full px-3 py-2 bg-muted border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Team B</label>
              <input
                type="text"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                placeholder="Enter team B name"
                className="w-full px-3 py-2 bg-muted border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
              />
            </div>

            <button
              onClick={handleCreateMatch}
              disabled={!teamA.trim() || !teamB.trim()}
              className="w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Match
            </button>
          </div>
        </div>

        {/* Match Management Section */}
        {matches.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Manage Matches</h2>

            <div className="space-y-3 mb-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatchId(match.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMatchId === match.id
                      ? "bg-muted border-primary"
                      : "bg-background border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {match.teamA} vs {match.teamB}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Status:{" "}
                        <span
                          className={
                            match.status === "started" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                          }
                        >
                          {match.status}
                        </span>
                      </p>
                    </div>
                    {match.status === "created" && <span className="text-xs bg-muted px-2 py-1 rounded">Ready</span>}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartMatch}
              disabled={!selectedMatchId || matches.find((m) => m.id === selectedMatchId)?.status === "started"}
              className="w-full px-4 py-2 bg-accent text-accent-foreground font-medium rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start Selected Match
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
