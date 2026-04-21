import mongoose from "mongoose";
import { tenentPlans, tenentStatus } from "./tenents.constants.js";
const { Schema, model } = mongoose;
const tenantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    domain: {
      type: String,
      lowercase: true,
      sparse: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    plan: {
      type: String,
      enum: tenentPlans,
      default: "free",
    },

    status: {
      type: String,
      enum: tenentStatus,
      default: "active",
    },

    settings: {
      currency: {
        type: String,
        default: "USD",
      },
      locale: {
        type: String,
        default: "en",
      },
      timezone: {
        type: String,
        default: "UTC",
      },
    },

    features: {
      inventory: { type: Boolean, default: false },
      hr: { type: Boolean, default: false },
      accounting: { type: Boolean, default: true },
    },

    billing: {
      subscriptionId: String,
      customerId: String,
      currentPeriodEnd: Date,
    },

    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  },
);
tenantSchema.index({ name: "text" });
tenantSchema.index({ ownerId: 1, createdAt: -1 });

// check if tenent is currently active or not
tenantSchema.methods.isActive = function () {
  return this.status === "active";
};

// generate slug based on name
tenantSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
});

const TenentModel = model("Tenent", tenantSchema);

export default TenentModel;
