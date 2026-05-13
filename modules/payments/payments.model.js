import { model, Schema, Types } from "mongoose";

const paymentsSchema = new Schema(
  {
    tenantId: {
      ref: "Tenent",
      type: Types.ObjectId,
    },
    amount: Number,
    method: {
      type: String,
      enum: ["cash", "bank", "card", "wallet"],
    },
    direction: {
      type: String,
      enum: ["in", "out"],
    },
    reference: String,
    description: String,
    invoiceId: {
      type: String,
      ref: "Invoice",
    },
    status: {
      type: String,
      enum: ["draft", "posted"],
      default: "draft",
    },
    createdBy: {
      ref: "User",
      type: Types.ObjectId,
    },
  },
  { timestamps: true },
);

const PaymentModel = model("Payment", paymentsSchema);

export default PaymentModel;
