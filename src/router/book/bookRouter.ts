import express from "express";
import path from "path";
import { createBook, bookUpdate } from "../../controllers/book/bookController";
import multer from "multer";

import { authenticate } from "../../middlewares/authenticate";
const bookRouter = express.Router();

// Routes

// file store local ->
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  // todo: put limit 10mb max.
  limits: { fileSize: 3e7 }, // 30mb 30 * 1024 * 1024
});
// routes
// /api/books
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

// update

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),

  bookUpdate
);

export default bookRouter;
