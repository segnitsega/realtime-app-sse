import express from "express";
import { Request, Response } from "express";
import db from "../model/match-model";

const userRouter = express.Router();

userRouter.get("/", (req: Request, res: Response) => {
  if (db.length === 0) res.status(404).json("No matches");
  res.json(db);
});

userRouter.get("/live", (req: Request, res: Response) => {
  const liveMatches = db.filter((match) => match.status === "live");
  if (!liveMatches || liveMatches.length === 0)
    res.status(404).json("No match started");
  res.status(200).json({ liveMatches });
});

userRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const match = db.find((m) => m.matchId === id);

  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }

  res.json(match);
});
export default userRouter;