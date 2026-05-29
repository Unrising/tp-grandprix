import { Router, Request, Response } from "express";
import { prisma } from "../db/prisma";

export const sessionsRouter = Router();

const sessionType = ["PRACTICE", "QUALIFYING", "SPRINT", "RACE"] as const;

type SessionType = typeof sessionType[number];

/*
 * POST /sessions
 * Créer une session
 */
sessionsRouter.post("/", async (req: Request, res: Response) => {
  let {
    day,
    type,
    date,
    priceMultiplier
  } = req.body;

  if (!day) {
    return res.status(400).json({ message: "day is required" });
  }

  if (!sessionType.includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  if (!date || typeof date !== "string"){
    return res.status(400).json({ message: "Date is required" });
  }

  if (!priceMultiplier) {
    switch(type) {
        case sessionType[0]:
            priceMultiplier = 0.5 
            break; 
        case sessionType[1]:
            priceMultiplier = 1.0
            break;
        case sessionType[2]: 
            priceMultiplier = 1.2
            break;
        case sessionType[3]:
            priceMultiplier = 1.8
            break;
        default:
            break;
    }
  }

  const session = await prisma.session.create({
    data: {
        day,
        type,
        date,
        priceMultiplier
    }
  });

  return res.status(201).json(session);
});



/**
 * GET /sessions
 * Lister les sessions
 */
sessionsRouter.get("/", async (req: Request, res: Response) => {

  const sessions = await prisma.session.findMany({
    orderBy: {
      id: "asc"
    }
  });

  return res.status(200).json(sessions);
});

