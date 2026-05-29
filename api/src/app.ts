import express from "express";
import { grandstandsRouter } from "./routes/grandstand.routes";
import { sessionsRouter } from "./routes/sessions.routes";

export const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

app.use("/grandstands", grandstandsRouter);
app.use("/sessions", sessionsRouter);