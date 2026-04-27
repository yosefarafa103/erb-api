import mongoose from "mongoose";

const { Schema, model } = mongoose;

const journalEntrySchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenent",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reference: String,
    description: String,
    sourceType: {
      type: String,
      enum: ["sale", "purchase", "payment"],
      default: "sale",
    },
    sourceId: {
      type: Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ["draft", "posted", "reversed"],
      default: "posted",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const JournalEntryModel = model("JournalEntry", journalEntrySchema);

export default JournalEntryModel;
