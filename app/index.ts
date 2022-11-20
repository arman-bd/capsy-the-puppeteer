// Imports
import express, { Request, Response, NextFunction } from "express";
import TaskRouter from "./routers/task";
import TrackerRouter from "./routers/tracker";

// Initialize
const app = express();
const port = 8800;

// Home
app.get("/", (req: Request, res: Response) => {
  res.send("Capsy the Puppeteer!");
});

// Ping
app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
  res.send("PONG at " + new Date());
});

// Routes
app.use("/task", TaskRouter);
app.use("/tracker", TrackerRouter);

// Launch Server
app.listen(port, () => {
  console.log(`Server Started on : http://localhost:${port}`);
});
