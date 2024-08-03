import { Request, Response, NextFunction } from "express";
import BookModel from "../../models/bookmodel/bookModels";
import cloudinary from "../../config/cloudinary";
import path from "path";
import fs from "fs";
import createHttpError from "http-errors";
import { AuthRequest } from "../../middlewares/authenticate";

/// Create a Book fun handeler

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

  const filename = files.coverImage[0].filename;

  const filepath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    filename
  );

  try {
    // File upload in Cloudinary

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      filename_override: filename,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;

    const bookFilepath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookfileUploadResult = await cloudinary.uploader.upload(
      bookFilepath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-Pdfs",
        format: "pdf",
      }
    );

    // File upload in Cloudinary end

    const _req = req as AuthRequest;

    /// Create a book
    const newbook = await BookModel.create({
      title,
      genre,
      author: _req.userID,
      coverImage: uploadResult.secure_url,
      file: bookfileUploadResult.secure_url,
    });

    await fs.promises.unlink(filepath);
    await fs.promises.unlink(bookFilepath);

    // save book in database
    await newbook.save();
    res.status(201).json({ msg: "Create a Book", newbook });
  } catch (err) {
    next(createHttpError(500, "Error while uploading the files"));
  }
};

export { createBook };
