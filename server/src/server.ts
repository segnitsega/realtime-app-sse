import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./model/match-model";

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

server.get("/matches/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const match = db.find((m) => m.matchId === id);

  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }

  res.json(match);
});


server.get("/live-matches", (req: Request, res: Response) => {
  const liveMatches = db.filter((match) => match.status === "live");
  if (!liveMatches || liveMatches.length === 0)
    res.status(404).json("No match started");
  res.status(200).json({ liveMatches });
});

server.post("/admin/create-match", (req: Request, res: Response) => {
  const { teamA, teamB, startTime } = req.body;
  if (!teamA || !teamB) {
    return res.status(400).send("Both team names are required");
  }

  db.push({
    matchId: `match_${db.length + 1}`,
    teamA,
    teamB,
    startTime,
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

  // let count = 1;
  // const interval = setInterval(()=>{
  //   res.write(`data: Message #${count}\n\n`)
  //   count++;
  // }, 1000)

  req.on("close", () => {
    // clearInterval(interval)
    clients = clients.filter((c) => c !== res);
  });
});

server.post("/admin/logs/:matchId", (req: Request, res: Response) => {
  const { matchId } = req.params;
  const { event } = req.body;

  console.log("Event log received", event);

  const match = db.find((match) => match.matchId === matchId);
  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }

  const eventToSave = {
    type: event.type,
    team: event.team,
    player: event.player,
    playerIn: event.playerIn,
    playerOut: event.playerOut,
    minute: event.minute,
  };

  if (event.type === "goal") {
    if (event.team === "teamA") match.scoreA++;
    if (event.team === "teamB") match.scoreB++;
  }

  if (event.type === "half-time" || event.type === "match-end") {
    match.status = event.type;
  }

  match.events.push(eventToSave);

    const broadcastEvent = {
    matchId,
    ...eventToSave,
    teamATotalGoal: match.scoreA,
    teamBTotalGoal: match.scoreB,
  };

  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(broadcastEvent)}\n\n`);
  });

  res.json({
    message: "Event logged & broadcasted",
    event: broadcastEvent,
    match,
  });
});

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
