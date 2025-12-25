// User controller handles user related stuff - registration and login logic

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

//Register a new user
export const register = async (req, res) =>{
  const { email, password } = req.body;

  if (!email || !password) { // Basic validation
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    // User already exists case check
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user in database
    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//login a registered user
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const result = await pool.query( // Find user
      "SELECT id, email, password FROM users WHERE email = $1", 
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" }); //No user found
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password); // Compare password

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign( // Create JWT
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token }); // Returns JWT token
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};