import express from "express";
import type { AddressInfo } from "node:net";
import subjectRouter from "./routes/subjects";
import cors from "cors";

const app = express();
const PORT = 8000;

if(!process.env.FRONTEND_URL){
  throw new Error("Missing FRONTEND_URL");
}

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

app.use(express.json());

app.use('/api/subjects', subjectRouter);

app.get("/", (_req, res) => {
  res.send("Classroom API ready");
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
