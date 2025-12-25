import express from "express";
import { login, register } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/register", register); //register route
userRouter.post("/login", login); //login route

export default userRouter;
