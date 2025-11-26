interface matchInterface {
  matchId: string; 
  teamA: string;
  teamB: string;
  scoreA: number | string;
  scoreB: number | string;
  status: "not started" | "live" | "ended";
  events: Array<{
    type: "goal" | "yellow card" | "red card" | "substitution";
    team: "Team 1" | "Team 2";
    player: string;
    minute: number | string;
  }>;
}

let db: matchInterface[] = [];

export default db;

