import { Request, Response, NextFunction } from "express";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "user Reguster" });
};

export { createUser };
