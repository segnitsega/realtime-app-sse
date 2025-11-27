import express from "express";
import { Request, Response } from "express";

const eventRouter = express.Router();
export let clients: Response[] = [];

eventRouter.get("/", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");

  clients.push(res);

  res.write("data: SSE connection established\n\n");

  req.on("close", () => {
    clients = clients.filter((c) => c !== res);
  });
});

export default eventRouter;
