import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRouter from "./routes/admin.route";
import eventRouter from "./routes/event.route";
import userRouter from "./routes/user.route";

dotenv.config();
const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use("/events", eventRouter);
server.use("/admin", adminRouter);
server.use("/matches", userRouter);

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
