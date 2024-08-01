import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import UserModel from "../../models/user/userModels";
import hashPassword from "../../helper/hashedPass";
import { signToken } from "../../helper/jwtTokenGen";
import { config } from "../../config/config";

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
  const hashedPassword = await hashPassword(password, 10);

  /// Create  a new User in Database
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });

  const payload = {
    id: newUser._id,
    name: newUser.name,
  };

  const token = signToken(payload, config.JWTSECKey as string, {
    expiresIn: "1d",
  });

  await newUser.save();

  // responce
  res.status(200).json({ message: "user Reguster", token });
};

export { createUser };
