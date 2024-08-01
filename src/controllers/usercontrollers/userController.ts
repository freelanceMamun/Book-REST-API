import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import UserModel from "../../models/user/userModels";

import Bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  /// validtaion
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All field are required");
    return next(error);
  }

  const user = await UserModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User already exists with email.");
    // Send the error in global error
    next(error);
  }

  // password hashed
  const hashedPassword = await Bcrypt.has(password, 10);

  /// Process

  // responce

  res.status(200).json({ message: "user Reguster" });
};

export { createUser };
