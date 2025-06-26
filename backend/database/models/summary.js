import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const cardSchema = new mongoose.Schema(
  {
    cardIndex: { type: Number, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const depthSummarySchema = new mongoose.Schema(
  {
    cards: { type: [cardSchema], required: true },
    imagePrompt: { type: String, required: true },
    imageUrl: { type: String, default: "" },
  },
  { _id: false }
);

const summarySchema = new mongoose.Schema(
  {
    summaryId: { type: String, default: uuid },
    bookId: { type: String, required: true, index: true }, // Link to book
    createdBy: { type: String, required: true }, // User UUID
    depth1: { type: depthSummarySchema, required: true }, // 1-card summary
    depth3: { type: depthSummarySchema, required: true }, // 3-card summary
    depth5: { type: depthSummarySchema, required: true }, // 5-card summary
  },
  { timestamps: true }
);

const SummaryModel = mongoose.model("Summary", summarySchema);
export default SummaryModel;
