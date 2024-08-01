import express, { Request, Response } from "express";
//import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalMiddlewares";
import userRouter from "./router/user/userRouter";
import bookRouter from "./router/book/bookRouter";
const app = express();

app.use(express.json());
app.use();

// Routes

app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);

app.get("/", (req: Request, res: Response) => {
  //   const error = createHttpError(400, "something is went worng");
  //   throw error;
  res.json({ message: "Welcome to Ebok" });
});

// ====== Global Error Handelr ============

app.use(globalErrorHandler);

export default app;
