import mongoose from "mongoose";

const { Schema, model } = mongoose;

const customerSchema = new Schema(
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

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: [true, "must be unique email!"]
    },

    phone: String,

    address: String,

    balance: {
      type: Number,
      default: 0,
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

customerSchema.index({ tenantId: 1, name: 1 });

const CustomerModel = model("Customer", customerSchema);

export default CustomerModel;
