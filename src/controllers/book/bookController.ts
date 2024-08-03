import { Request, Response, NextFunction } from "express";
import BookModel from "../../models/bookmodel/bookModels";
import cloudinary from "../../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
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

// === update controller

const bookUpdate = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const _req = req as AuthRequest;

  const book = await BookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError({ message: "Book not found.!" }));
  }

  if (book.author.toString() !== _req.userID) {
    return next(createHttpError(403, { message: "Unauthorized" }));
  }

  let completeCoverImage = "";

  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const filepath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );

    completeCoverImage = filename;

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    completeCoverImage = uploadResult.secure_url;

    await fs.promises.unlink(filepath);
  }

  let completeFilename = "";

  if (files.file) {
    const bookFileName = files.file[0].filename;
    const bookFilepath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    completeFilename = bookFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilepath, {
      resource_type: "raw",
      filename_override: completeFilename,
      folder: "book-Pdfs",
      format: "pdf",
    });

    completeFilename = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilepath);
  }

  const updateBook = await BookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFilename ? completeFilename : book.file,
    },
    {
      new: true,
    }
  );

  // update book for data base

  res.status(202).json({
    message: "Book updated successfully",
    updateBook,
  });
};

export { createBook, bookUpdate };
