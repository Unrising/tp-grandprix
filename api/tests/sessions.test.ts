import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/db/prisma";

beforeEach(async () => {
  await prisma.reservationSession.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.session.deleteMany();

  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "Session_id_seq" RESTART WITH 1`
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /sessions", () => {
    it("should create a new session", async () => {
        const response = await request(app)
            .post("/sessions")
            .send({
                day: "FRIDAY",
                type: "PRACTICE",
                date: "2026-07-19T14:00:00Z",
                priceMultiplier: "1.8"
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            id: 1,
            day: "FRIDAY",
            type: "PRACTICE",
            date: "2026-07-19T14:00:00.000Z",
            priceMultiplier: "1.8"
        });
    });

        it("should create a new session with a default value", async () => {
        const response = await request(app)
            .post("/sessions")
            .send({
                day: "FRIDAY",
                type: "PRACTICE",
                date: "2026-07-19T14:00:00Z",
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            id: 1,
            day: "FRIDAY",
            type: "PRACTICE",
            date: "2026-07-19T14:00:00.000Z",
            priceMultiplier: "0.5"
        });
    });


    it("should return 400 if a value is missing", async () => {
        const response = await request(app)
            .post("/sessions")
            .send({});

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: "day is required"
        });
    });
});

describe("GET /sessions", () => {
  it("should return sessions", async () => {
    await prisma.session.createMany({
      data: [
        {
            day: "FRIDAY",
            type: "PRACTICE",
            date: "2026-07-19T14:00:00.000Z",
            priceMultiplier: "0.5"
        },
        {
            day: "FRIDAY",
            type: "PRACTICE",
            date: "2026-07-19T14:00:00.000Z",
            priceMultiplier: "0.5"
        }
      ]
    });

    const response = await request(app).get("/sessions");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);

    expect(response.body[0]).toMatchObject({
        day: "FRIDAY",
        type: "PRACTICE",
        date: "2026-07-19T14:00:00.000Z",
        priceMultiplier: "0.5"
    },
    );
  });
});

