import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./model/match-model";
import { matchInterface } from "./model/match-model";

dotenv.config();
const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

let clients: Response[] = [];

server.get("/matches", (req: Request, res: Response) => {
  if (db.length === 0) res.status(404).json("No matches");
  res.json(db);
});

server.get("/live-matches", (req: Request, res: Response) => {
  const liveMatches = db.filter((match) => match.status === "live");
  if (!liveMatches || liveMatches.length === 0)
    res.status(404).json("No match started");
  res.status(200).json({ liveMatches });
});

server.post("/admin/create-match", (req: Request, res: Response) => {
  const { teamA, teamB } = req.body;
  if (!teamA || !teamB) {
    return res.status(400).send("Both team names are required");
  }
  
  db.push({
    matchId: `match_${db.length + 1}`,
    teamA,
    teamB,
    scoreA: 0,
    scoreB: 0,
    status: "not-started",
    events: [],
  });
  res.status(201).json({ message: "Match created" });
});

server.post("/admin/start-match/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const match = db.find((m) => m.matchId === id);
  if (!match) {
    return res.status(404).send("Match not found");
  }
  match.status = "live";
  res.status(200).json({ message: "Match started" });
});

server.get("/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");

  //   const client = {id: nextId++, res}
  clients.push(res);

  res.write("data: SSE connection established\n\n");

  let count = 1;
  const interval = setInterval(()=>{
    res.write(`data: Message #${count}\n`)
    count++;
  }, 1000)

  req.on("close", () => {
    clearInterval(interval)
    clients = clients.filter((c) => c !== res);
  });
});

server.post("/admin/logs/:id", (req: Request, res: Response) => {
  const { matchId } = req.params;
  const { event } = req.body;

  const match: matchInterface | undefined = db.find(
    (match) => match.matchId === matchId
  );

  interface eventType {
    matchId: string;
    type: string;
    team?: string;
    player?: string;
    playerIn?: string;
    playerOut?: string;
    teamATotalGoal?: number ;
    teamBTotalGoal?: number ;
    minute: number | string;
  }

  const broadcastEvent: eventType = {
    matchId: matchId,
    type: event.type || "",
    team: event.team || "",
    player: event.player || "",
    playerIn: event.playerIn || "",
    playerOut: event.playerOut || "",
    minute: event.minute,
    teamATotalGoal: match?.scoreA,
    teamBTotalGoal: match?.scoreB,
  };

  if (!match) res.status(404).json({ message: "match not found" });
  else {
    broadcastEvent.matchId = matchId;
    if (event.type === "goal") {
      broadcastEvent.type = "goal";
      if (event.team === "teamA") {
        broadcastEvent.teamATotalGoal = match.scoreA++;
        broadcastEvent.team = "teamA";
      } else {
        broadcastEvent.teamBTotalGoal = match.scoreB++;
        broadcastEvent.team = "teamB";
      }
      broadcastEvent.player = event.player;
    } else if (event.type === "match-end" || event.type === "half-time") {
      match.status = event.type;
      broadcastEvent.type = match.status;
    } else if (event.type === "substitution") {
      broadcastEvent.type = "substitution";
      broadcastEvent.playerIn = event.playerIn;
      broadcastEvent.playerOut = event.playerOut;
    }
    broadcastEvent.minute = event.minute;
  }

  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(broadcastEvent)}`);
  });

  res.json({
    message: "log updated successfully",
    db,
  });
});

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
