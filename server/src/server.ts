import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./model/match-model";

dotenv.config();
const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

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
    status: "not started",
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

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});


