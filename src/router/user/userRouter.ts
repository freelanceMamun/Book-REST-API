import express from "express";
import { createUser } from "../../controllers/usercontrollers/userController";
const userRouter = express.Router();

// Routes

userRouter.post("/register", createUser);

export default userRouter;
