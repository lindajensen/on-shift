import express, { Request, Response } from "express";
import cors from "cors";
import client from "./db";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (request: Request, response: Response) => {
  response.send("Helloooo!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
