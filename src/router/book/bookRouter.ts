import express from "express";

import { createBook } from "../../controllers/book/bookController";
const bookRouter = express.Router();

// Routes

bookRouter.post("/create", createBook);

export default bookRouter;
