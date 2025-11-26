import express, {Request, Response} from "express";
import dotenv from "dotenv";

dotenv.config();
const server = express()
const port = process.env.PORT;

server.get("/", (req: Request, res: Response) => {
    res.send("Received")
})

server.listen(port ,()=>{
    console.log("Server started")
})




// 1. Admin Features
// - Provide an endpoint for admins to create a match with two teams.
// - Provide another endpoint to start the match.
// (No need to handle authentication, just have separate endpoints.)