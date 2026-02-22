import express from "express";
import type { AddressInfo } from "node:net";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Classroom API ready");
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
