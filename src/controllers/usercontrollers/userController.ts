import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import UserModel from "../../models/user/userModels";
import hashPassword, { comparePassword } from "../../helper/hashedPass";
import { signToken } from "../../helper/jwtTokenGen";
import { config } from "../../config/config";

// Create a new  user handelr
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  /// validtaion
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All field are required");
    return next(error);
  }

  let token = "";

  try {
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

    token = signToken(payload, config.JWTSECKey as string, {
      expiresIn: "1d",
    });

    await newUser.save();
  } catch (error) {
    return next(createHttpError(500, "Error while Getting user"));
  }

  // responce
  res.status(201).json({ message: "user Reguster", token });
};

//Login User handeler

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  /// validtaion
  const { email, password } = req.body;

  if (!email || !password) {
    const error = createHttpError(400, "All field are required");
    return next(error);
  }

  let token = "";

  try {
    const user = await UserModel.findOne({ email });
    // finduser in db
    if (!user) {
      return next(createHttpError(404, "User not  found!"));
    }

    // check the password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return next(createHttpError(401, "Invalid Credential"));
    }

    // create a Login and genarate token

    const payload = {
      id: user._id,
      name: user.name,
    };

    token = signToken(payload, config.JWTSECKey as string, {
      expiresIn: "7d",
    });
  } catch (error) {
    return next(createHttpError(500, "Error"));
  }

  res.json({ mesg: "isOK", token });
};

export { createUser, loginUser };
