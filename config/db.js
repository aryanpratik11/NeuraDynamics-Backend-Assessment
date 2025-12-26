// PostgreSQL database configuration - Creates a connection pool - environment variables stored in .env

import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

// Connection pool for PostgreSQL for reuse of DB connections
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.NODE_ENV === "test" ? "localhost" : process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export default pool;