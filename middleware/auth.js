/**
 * JWT authentication middleware
 * - Verifies JWT token from Authorization header
 * - Attaches decoded user info to req.user
 * - Blocks unauthorized access
 */

import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Extract token from authorization
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //Verify token
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default authenticateToken;