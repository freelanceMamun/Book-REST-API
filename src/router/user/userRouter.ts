import express from "express";
import {
  createUser,
  loginUser,
} from "../../controllers/usercontrollers/userController";
const userRouter = express.Router();

// Routes

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

export default userRouter;
