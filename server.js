/** Entry point of the application that
 * - Sets up global middleware
 * - Add routes
 * - Starts the server logic
 * - Proper modular structure of code with routes, controllers, middlewares, utils and config
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import authenticateToken from "./middleware/auth.js";
import userRouter from "./routes/userRoute.js";
import docRouter from "./routes/docRoute.js";
import { initWebSocket } from "./ws/updateStatus.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(cors()); //Enables CORS
app.use(express.json()); //Parses incoming JSON
app.use(express.urlencoded({ extended: true }));

//Routes defination
app.use("/auth", userRouter); //authentication related routes
app.use("/documents", docRouter); //document management routes


//Server & WebSocket Setup
const server = http.createServer(app);
initWebSocket(server);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

