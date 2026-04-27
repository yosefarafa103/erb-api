import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenent",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    barcode: String,

    description: String,

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    cost: {
      type: Number,
      default: 0,
    },

    quantity: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      default: "pcs",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

productSchema.index({ tenantId: 1, name: 1 });

const ProductModel = model("Product", productSchema);

export default ProductModel;
