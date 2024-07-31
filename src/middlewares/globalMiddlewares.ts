import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;

  next();
  return res.status(statusCode).json({
    message: error.message,
    errorStack: config.Env === "development" ? error.stack : "Bad Request",
  });
};

export default globalErrorHandler;
