import mongoose from "mongoose";

const { Schema, model } = mongoose;

const inventorySchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenent",
      required: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["in", "out", "adjustment"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "sale",
        "purchase",
        "return",
        "opening_stock",
        "manual_adjustment",
      ],
      required: true,
    },

    referenceType: {
      type: String,
      enum: ["sale", "purchase"],
    },

    referenceId: {
      type: Schema.Types.ObjectId,
    },

    unitCost: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

inventorySchema.index({ tenantId: 1, productId: 1 });

const InventoryModel = model("InventoryMovement", inventorySchema);

export default InventoryModel;
