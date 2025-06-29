import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const bookSchema = new mongoose.Schema(
  {
    bookId: { type: String, default: uuid },
    title: { type: String, required: true },
    author: { type: String, default: "Unknown" },
    coverImageUrl: { type: String, default: "default_cover_url" },
    tags: [String],
    sourcePdfUrl: { type: String, required: true },
    language: { type: String, default: "en" },
    // vectorStatus: {
    //   type: String,
    //   enum: ["pending", "done", "error"],
    //   default: "pending",
    // },
  },
  { timestamps: true }
);

const BookModel = mongoose.model("Book", bookSchema);
export default BookModel;

const bookBookMarkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    bookId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

bookFollowSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const BookBookMarkModel = mongoose.model("BookBookMark", bookBookMarkSchema);
export { BookBookMarkModel };
