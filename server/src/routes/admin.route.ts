import express from "express";
import { Request, Response } from "express";
import db from "../model/match-model";
import { clients } from "./event.route";

const adminRouter = express.Router();


adminRouter.post("/create-match", (req: Request, res: Response) => {
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

adminRouter.post("/start-match/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const match = db.find((m) => m.matchId === id);
  if (!match) {
    return res.status(404).send("Match not found");
  }
  match.status = "live";
  res.status(200).json({ message: "Match started" });
});


adminRouter.post("/logs/:matchId", (req: Request, res: Response) => {
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

export default adminRouter;