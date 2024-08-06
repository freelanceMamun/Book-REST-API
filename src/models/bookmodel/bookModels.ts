import mongoose from "mongoose";
import { Book } from "./bookType";

const bookSchema = new mongoose.Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  coverImage: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  genre: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
});

const BookModel = mongoose.model<Book>("Book", bookSchema);

export default BookModel;
