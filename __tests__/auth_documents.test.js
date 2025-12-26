import { jest } from "@jest/globals";
import request from "supertest";
import pool from "../config/db.js";
import { app } from "../server.js";

jest.setTimeout(20000);

let tokenA;
let tokenB;
let documentId;
let categoryId;

beforeAll(async () => {
  // Clean DB (order matters due to FK)
  await pool.query("DELETE FROM documents");
  await pool.query("DELETE FROM categories");
  await pool.query("DELETE FROM users");

  // Create category
  const categoryRes = await pool.query(
    "INSERT INTO categories (name) VALUES ($1) RETURNING id",
    ["Private"]
  );
  categoryId = categoryRes.rows[0].id;

  // Register users
  await request(app).post("/auth/register").send({
    email: "usera@test.com",
    password: "password123",
  });

  await request(app).post("/auth/register").send({
    email: "userb@test.com",
    password: "password123",
  });

  // Login User A
  const loginA = await request(app).post("/auth/login").send({
    email: "usera@test.com",
    password: "password123",
  });
  tokenA = loginA.body.token;

  // Login User B
  const loginB = await request(app).post("/auth/login").send({
    email: "userb@test.com",
    password: "password123",
  });
  tokenB = loginB.body.token;
});

test("User A uploads document", async () => {
  const res = await request(app)
    .post("/documents/upload")
    .set("Authorization", `Bearer ${tokenA}`)
    .field("title", "Secret Doc")
    .field("categoryId", categoryId.toString()) // ⚠️ multipart → string
    .attach("file", Buffer.from("test file"), "test.txt");

  expect(res.statusCode).toBe(201);
  expect(res.body.message).toBe("Document uploaded successfully");

  // Fetch document ID for next test
  const docs = await request(app)
    .get("/documents")
    .set("Authorization", `Bearer ${tokenA}`);

  documentId = docs.body[0].id;
});

test("User B cannot delete User A document", async () => {
  const res = await request(app)
    .delete(`/documents/${documentId}`)
    .set("Authorization", `Bearer ${tokenB}`);

  expect(res.statusCode).toBe(403);
});

afterAll(async () => {
  await pool.end();
});
