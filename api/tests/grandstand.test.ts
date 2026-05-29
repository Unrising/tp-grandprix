import request from "supertest";
import { app } from "../src/app";

describe("POST /grandstand", () => {
    it("should create a new grandstand", async () => {
        const response = await request(app)
            .post("/grandstand")
            .send({
                "name": "Tribune Sainte-Beaume",
                "location": "Virage 3",
                "category": "BRONZE",
                "capacity": 200,
                "basePrice": 180,
                "covered": false
            });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: 1,
            "name": "Tribune Sainte-Beaume",
            "location": "Virage 3",
            "category": "BRONZE",
            "capacity": 200,
            "basePrice": 180,
            "covered": false
        });
    });

    it("should return 400 if a value is missing", async () => {
      const response = await request(app)
        .post("/grandstand")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        name: "Tribune Sainte-Beaume",
        location: "Virage 3",
        category: "BRONZE",
        capacity: 200,
        basePrice: 180,
        covered: false
      });
    });
});