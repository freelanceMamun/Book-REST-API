import jwt, { JwtPayload } from "jsonwebtoken";

// signToken and Generate Token

export function signToken(
  payload: object,
  secret: string,
  options?: jwt.SignOptions
): string {
  return jwt.sign(payload, secret, options);
}

/// verifyToken

export function verifyToken(token: string, secret: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "object" && decoded !== null) {
      return decoded as JwtPayload;
    } else {
      throw new Error("Invalid token payload");
    }
  } catch (error) {
    throw new Error("Invalid token");
  }
}

