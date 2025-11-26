export interface matchInterface {
  matchId: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  status: "not-started" | "live" | "ended" | "half-time";
  events: Array<{
    type:
      | "goal"
      | "yellow-card"
      | "red-card"
      | "substitution"
      | "match-end"
      | "half-time";
    team: "teamA" | "teamB";
    player?: string;
    playerIn?: string;
    playerOut?: string;
    minute: number | string;
  }>;
}

let db: matchInterface[] = [];

export default db;
