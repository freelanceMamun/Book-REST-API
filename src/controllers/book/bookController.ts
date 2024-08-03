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

// Get all Book handeler

const ListAllBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract pagination parameters from the query
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    // Fetch the books with pagination
    const books = await BookModel.find().skip(skip).limit(limit);

    return res.status(200).json(books);
  } catch (error) {
    next(createHttpError(500, "500 Error while getting a book"));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bookdId } = req.params;

  try {
    const findBook = await BookModel.findOne({ _id: bookdId });

    if (!findBook) {
      return next(createHttpError(403, "Book not found"));
    }
    return res.status(200).json(findBook);
  } catch (error) {
    return next(createHttpError(500, "500 Error while getting a book"));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const { bookdId } = req.params;

  try {
    const findBook = await BookModel.findOne({ _id: bookdId });

    if (!findBook) {
      return next(createHttpError(403, "Book not found"));
    }

    const _req = req as AuthRequest;

    if (findBook.author.toString() !== _req.userID) {
      return next(createHttpError(403, { message: "Unauthorized" }));
    }

    const coverFileSplit = findBook.coverImage.split("/");

    const coverImagePublicId =
      coverFileSplit.at(-2) + "/" + coverFileSplit.at(-1)?.split(".").at(-2);

    //   await cloudinary.uploader.destroy();

    console.log(coverImagePublicId);

    res.json({});
  } catch (error) {
    return next(createHttpError(500, "500 Error while getting a book"));
  }
};

export { createBook, bookUpdate, ListAllBook, getSingleBook, deleteBook };
