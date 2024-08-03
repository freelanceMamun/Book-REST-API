import { Response, NextFunction, Request } from "express";
import createHttpError from "http-errors";
import { config } from "../config/config";
import { verifyToken } from "../helper/jwtTokenGen";

export interface AuthRequest extends Request {
  userID: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const getToken = req.header("Authorization") as string;

  if (!getToken) {
    next(createHttpError(401, "Authorization is required."));
  }

  try {
    const parsedToken = getToken.split(" ")[1];
    const decoded = verifyToken(parsedToken, config.JWTSECKey as string);

    const _req = req as AuthRequest;
    _req.userID = decoded.id as string;
    next();
  } catch (error) {
    next(createHttpError(401, "Token Expired"));
  }
};

export { authenticate };
