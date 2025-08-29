import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send(`Hello AI App!  ${process.env.OPEN_API_KEY}`);
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello Sai" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
