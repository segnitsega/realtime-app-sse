
import type React from "react"

import { useState } from "react"
import type { Match } from "./admin-dashboard"

interface EventFormProps {
  match: Match
  onSubmit: (eventType: string, minute: number, details: Record<string, string>) => void
  onCancel: () => void
}

export default function EventForm({ match, onSubmit, onCancel }: EventFormProps) {
  const [eventType, setEventType] = useState("goal")
  const [minute, setMinute] = useState("")
  const [team, setTeam] = useState("teamA")
  const [playerName, setPlayerName] = useState("")
  const [playerOut, setPlayerOut] = useState("")
  // const [cardType, setCardType] = useState("yellow")

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!minute) return;

  const details: Record<string, string> = { team };

  if (eventType === "goal" || eventType === "yellow-card" || eventType === "red-card") {
    details.player = playerName;
  }

  if (eventType === "substitution") {
    details.playerIn = playerName;
    details.playerOut = playerOut;
  }

  onSubmit(eventType, Number.parseInt(minute), details);

  setEventType("goal");
  setMinute("");
  setPlayerName("");
  setPlayerOut("");
};


  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div>
        <label className="block text-xs font-bold mb-1">Event Type</label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="goal">Goal</option>
          <option value="substitution">Substitution</option>
          <option value="yellow-card">Yellow Card</option>
          <option value="red-card">Red Card</option>
          <option value="half-time">Half-time</option>
          <option value="match-end">Full-time</option>
        </select>
      </div>
    
      <div>
        <label className="block text-xs font-bold mb-1">Minute</label>
        <input
          type="number"
          min="0"
          max="120"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          placeholder="45"
          className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {eventType !== "half-time" && eventType !== "match-end" && (
        <>
          <div>
            <label className="block text-xs font-bold mb-1">Team</label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="teamA">{match.teamA}</option>
              <option value="teamB">{match.teamB}</option>
            </select>
          </div>

          {(eventType === "goal" || eventType === "yellow-card" || eventType === "red-card") && (
            <div>
              <label className="block text-xs font-bold mb-1">Player Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Player name"
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {eventType === "substitution" && (
            <>
              <div>
                <label className="block text-xs font-bold mb-1">Player In</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Player in"
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Player Out</label>
                <input
                  type="text"
                  value={playerOut}
                  onChange={(e) => setPlayerOut(e.target.value)}
                  placeholder="Player out"
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}
        </>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded font-bold text-xs hover:bg-primary/90 transition-colors"
        >
          Add Event
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded font-bold text-xs hover:bg-secondary/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
