import { Router, Request, Response } from "express";
import { prisma } from "../db/prisma";

export const grandstandsRouter = Router();

const allowedCategories = ["BRONZE", "SILVER", "GOLD", "PLATINUM"] as const;

type GrandstandCategory = typeof allowedCategories[number];

/**
 * POST /grandstands
 * Créer une tribune
 */
grandstandsRouter.post("/", async (req: Request, res: Response) => {
  const {
    name,
    location,
    category,
    capacity,
    baseSeatPrice,
    covered
  } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Name is required" });
  }

  if (!location || typeof location !== "string") {
    return res.status(400).json({ message: "Location is required" });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  if (typeof capacity !== "number" || capacity <= 0) {
    return res.status(400).json({
      message: "Capacity must be a positive number"
    });
  }

  if (typeof baseSeatPrice !== "number" || baseSeatPrice <= 0) {
    return res.status(400).json({
      message: "Base seat price must be a positive number"
    });
  }

  if (typeof covered !== "boolean") {
    return res.status(400).json({
      message: "Covered must be a boolean"
    });
  }

  const grandstand = await prisma.grandstand.create({
    data: {
      name,
      location,
      category,
      capacity,
      baseSeatPrice,
      covered
    }
  });

  return res.status(201).json(grandstand);
});

/**
 * GET /grandstands?category=BRONZE
 * Lister les tribunes par catégorie
 */
grandstandsRouter.get("/", async (req: Request, res: Response) => {
  const category = req.query.category;

  if (!category || typeof category !== "string") {
    return res.status(400).json({
      message: "Category query parameter is required"
    });
  }

  if (!allowedCategories.includes(category as GrandstandCategory)) {
    return res.status(400).json({
      message: "Invalid category"
    });
  }

  const grandstands = await prisma.grandstand.findMany({
    where: {
      category: category as GrandstandCategory
    },
    orderBy: {
      id: "asc"
    }
  });

  return res.status(200).json(grandstands);
});