import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/db/prisma";

beforeEach(async () => {
  await prisma.reservationSession.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.grandstand.deleteMany();

  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "Grandstand_id_seq" RESTART WITH 1`
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /grandstands", () => {
  it("should create a new grandstand", async () => {
    const response = await request(app)
      .post("/grandstands")
      .send({
        name: "Tribune Sainte-Beaume",
        location: "Virage 3",
        category: "BRONZE",
        capacity: 200,
        baseSeatPrice: 180,
        covered: false
      });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      id: 1,
      name: "Tribune Sainte-Beaume",
      location: "Virage 3",
      category: "BRONZE",
      capacity: 200,
      covered: false
    });

    expect(Number(response.body.baseSeatPrice)).toBe(180);
  });

  it("should return 400 if a value is missing", async () => {
    const response = await request(app)
      .post("/grandstands")
      .send({});

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Name is required"
    });
  });
});

describe("GET /grandstands?category=", () => {
  it("should return grandstands filtered by category", async () => {
    await prisma.grandstand.createMany({
      data: [
        {
          name: "Tribune Bronze",
          location: "Virage 1",
          category: "BRONZE",
          capacity: 200,
          baseSeatPrice: 180,
          covered: false
        },
        {
          name: "Tribune Gold",
          location: "Virage 2",
          category: "GOLD",
          capacity: 300,
          baseSeatPrice: 250,
          covered: true
        }
      ]
    });

    const response = await request(app).get("/grandstands?category=BRONZE");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);

    expect(response.body[0]).toMatchObject({
      id: 1,
      name: "Tribune Bronze",
      location: "Virage 1",
      category: "BRONZE",
      capacity: 200,
      covered: false
    });

    expect(Number(response.body[0].baseSeatPrice)).toBe(180);
  });
});