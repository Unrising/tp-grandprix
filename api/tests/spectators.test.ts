import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/db/prisma";

beforeEach(async () => {
  await prisma.reservationSession.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.spectator.deleteMany();

  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "Specator_id_seq" RESTART WITH 1`
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /spectators", () => {
    it("should create a new spectator", async () => {
        const response = await request(app)
            .post("/spectactors")
            .send({
                name: "Alice Martin",
                email: "alice@example.com",
                birthDate: "1990-04-12",
                loyaltyTier: "NONE"
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            id: 1,
            name: "Alice Martin",
            email: "alice@example.com",
            birthDate: "1990-04-12",
            loyaltyTier: "NONE"
        });
    });

    it("should return 400 if a email is duplicated", async () => {
        await prisma.spectator.create({
            data: {
                name: "Alice Martin",
                email: "alice@example.com",
                birthDate: "1990-04-12",
                loyaltyTier: "NONE"
            }
        });

        const response = await request(app)
            .post("/spectator")
            .send({               
                name: "Alice Martin",
                email: "alice@example.com",
                birthDate: "1990-04-12",
                loyaltyTier: "NONE"
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: "email duplication"
        });
    });

    it("should return 400 if a birthDate > date is missing", async () => {

        const response = await request(app)
            .post("/spectator")
            .send({               
                name: "Alice Martin",
                email: "alice@example.com",
                birthDate: Date.now() + 10,
                loyaltyTier: "NONE"
            });

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            message: "email duplication"
        });
    });
});


describe("GET /spectator", () => {
  it("should return spectator", async () => {
    await prisma.spectator.createMany({
      data: [
        {
            name: "Alice Martin",
            email: "alice@example.com",
            birthDate: "1990-04-12",
            loyaltyTier: "NONE"
        },
        {
            name: "Michael Picard",
            email: "micahel@example.com",
            birthDate: "1999-11-27",
            loyaltyTier: "NONE"
        }
      ]
    });

    const response = await request(app).get("/spectator");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);

    expect(response.body[0]).toMatchObject({
        name: "Alice Martin",
        email: "alice@example.com",
        birthDate: "1990-04-12",
        loyaltyTier: "NONE"
    },
    );
  });
});

