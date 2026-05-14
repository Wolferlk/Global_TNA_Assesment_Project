import "dotenv/config";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import { connectDb } from "../src/config/db.js";
import { JobRequest } from "../src/models/JobRequest.js";
import { User } from "../src/models/User.js";

process.env.MONGODB_DB = "service_request_board_test";
process.env.JWT_SECRET = "test_secret";

const validJob = {
  title: "Leaking kitchen tap",
  description: "Water is dripping from the tap and cupboard pipework.",
  category: "Plumbing",
  location: "Glasgow",
  contactName: "Maya Fraser",
  contactEmail: "maya@example.com"
};

describe("jobs API", () => {
  before(async () => {
    await connectDb();
  });

  beforeEach(async () => {
    await JobRequest.deleteMany({});
    await User.deleteMany({});
  });

  after(async () => {
    await JobRequest.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it("creates a job with default Open status", async () => {
    const token = await getAuthToken();
    const response = await request(app).post("/api/jobs").set("Authorization", `Bearer ${token}`).send(validJob).expect(201);

    assert.equal(response.body.title, validJob.title);
    assert.equal(response.body.status, "Open");
    assert.ok(response.body.createdAt);
  });

  it("validates required fields and email format", async () => {
    const token = await getAuthToken();
    const missingFields = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({ contactEmail: "bad-email" })
      .expect(400);

    assert.ok(missingFields.body.errors.some((message) => message.includes("Title is required")));
    assert.ok(missingFields.body.errors.some((message) => message.includes("Description is required")));
    assert.ok(missingFields.body.errors.some((message) => message.includes("Contact email must be valid")));
  });

  it("requires login to create a job", async () => {
    const response = await request(app).post("/api/jobs").send(validJob).expect(401);

    assert.equal(response.body.message, "Login required");
  });

  it("lists jobs and supports category, status, and search filters", async () => {
    await JobRequest.create([
      validJob,
      { ...validJob, title: "Paint hallway", category: "Painting", status: "Closed" },
      { ...validJob, title: "Install outdoor socket", description: "Outdoor power supply", category: "Electrical", status: "In Progress" }
    ]);

    const allJobs = await request(app).get("/api/jobs").expect(200);
    const plumbingJobs = await request(app).get("/api/jobs?category=Plumbing").expect(200);
    const closedJobs = await request(app).get("/api/jobs?status=Closed").expect(200);
    const searchJobs = await request(app).get("/api/jobs?search=outdoor").expect(200);

    assert.equal(allJobs.body.length, 3);
    assert.equal(plumbingJobs.body.length, 1);
    assert.equal(plumbingJobs.body[0].category, "Plumbing");
    assert.equal(closedJobs.body.length, 1);
    assert.equal(closedJobs.body[0].status, "Closed");
    assert.equal(searchJobs.body.length, 1);
    assert.equal(searchJobs.body[0].category, "Electrical");
  });

  it("fetches one job by id", async () => {
    const job = await JobRequest.create(validJob);
    const response = await request(app).get(`/api/jobs/${job.id}`).expect(200);

    assert.equal(response.body._id, job.id);
  });

  it("returns 404 for missing jobs", async () => {
    const id = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/jobs/${id}`).expect(404);

    assert.equal(response.body.message, "Job not found");
  });

  it("updates status only", async () => {
    const job = await JobRequest.create(validJob);
    const response = await request(app)
      .patch(`/api/jobs/${job.id}`)
      .send({ status: "In Progress", title: "Should not change" })
      .expect(200);

    assert.equal(response.body.status, "In Progress");
    assert.equal(response.body.title, validJob.title);
  });

  it("rejects invalid status updates", async () => {
    const job = await JobRequest.create(validJob);
    const response = await request(app).patch(`/api/jobs/${job.id}`).send({ status: "Done" }).expect(400);

    assert.equal(response.body.message, "Status must be Open, In Progress, or Closed");
  });

  it("deletes a job", async () => {
    const token = await getAuthToken();
    const job = await JobRequest.create(validJob);

    await request(app).delete(`/api/jobs/${job.id}`).set("Authorization", `Bearer ${token}`).expect(204);

    const deleted = await JobRequest.findById(job.id);
    assert.equal(deleted, null);
  });

  it("requires login to delete a job", async () => {
    const job = await JobRequest.create(validJob);
    const response = await request(app).delete(`/api/jobs/${job.id}`).expect(401);

    assert.equal(response.body.message, "Login required");
  });
});

async function getAuthToken() {
  const response = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: `test${Date.now()}${Math.random()}@example.com`,
    password: "password123"
  });

  return response.body.token;
}
