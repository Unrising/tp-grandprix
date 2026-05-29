import express from "express";
import { grandstandsRouter } from "./routes/grandstand.routes";

export const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

app.use("/grandstands", grandstandsRouter);