import { model, Schema, Types } from "mongoose";

const invoiceSchema = new Schema(
  {
    tenantId: {
      type: Types.ObjectId,
      ref: "Tenent",
      required: true,
      index: true,
    },

    customerId: {
      type: Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    items: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
        },
        name: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],

    subTotal: Number,
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: Number,

    status: {
      type: String,
      enum: ["draft", "confirmed", "partial", "paid", "cancelled"],
      default: "draft",
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const InvoiceModel = model("Invoice", invoiceSchema);

export default InvoiceModel;
