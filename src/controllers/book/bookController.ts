import { Request, Response, NextFunction } from "express";
import BookModel from "../../models/bookmodel/bookModels";

/// Create a Book fun handeler

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

  res.status(201).json({ msg: "Create a Book" });
};

export { createBook };
