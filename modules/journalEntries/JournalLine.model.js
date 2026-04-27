import mongoose from "mongoose";

const { Schema, model } = mongoose;

const journalLineSchema = new Schema(
  {
    journalEntryId: {
      type: Schema.Types.ObjectId,
      ref: "JournalEntry",
      required: true,
      index: true,
    },

    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    debit: {
      type: Number,
      default: 0,
      min: 0,
    },

    credit: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: String,

    entityType: {
      type: String, // "customer" | "vendor"
    },

    entityId: {
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const JournalLineModel = model("JournalLine", journalLineSchema);

export default JournalLineModel;