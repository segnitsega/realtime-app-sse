import express, {Request, Response} from "express";

const server = express()

server.listen(8080 ,()=>{
    console.log("Server started")
})

server.get("/", (req: Request, res: Response) => {
    res.send("Received")
})