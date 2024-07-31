import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  /// validtaion
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All field are required");
    return next(error);
  }

  /// Process

  // responce

  res.status(200).json({ message: "user Reguster" });
};

export { createUser };
