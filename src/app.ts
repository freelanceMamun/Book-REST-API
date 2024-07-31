import express, { Request, Response } from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalMiddlewares";
const app = express();

// Routes

app.get("/", (req: Request, res: Response) => {
  const error = createHttpError(400, "something is went worng");
  throw error;
  res.json({ message: "Welcome to Ebok" });
});

// ====== Global Error Handelr ============

app.use(globalErrorHandler);

export default app;
