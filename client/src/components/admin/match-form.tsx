
import type React from "react"

import { useState } from "react"

interface MatchFormProps {
  onSubmit: (teamA: string, teamB: string, startTime: string) => void
  onCancel: () => void
}

export default function MatchForm({ onSubmit, onCancel }: MatchFormProps) {
  const [formData, setFormData] = useState({
    teamA: "",
    teamB: "",
    startTime: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.teamA && formData.teamB) {
      onSubmit(formData.teamA, formData.teamB, formData.startTime)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h3 className="text-lg font-bold mb-4">Create New Match</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Team A"
            value={formData.teamA}
            onChange={(e) => setFormData({ ...formData, teamA: e.target.value })}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Team B"
            value={formData.teamB}
            onChange={(e) => setFormData({ ...formData, teamB: e.target.value })}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <input
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Create Match
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
