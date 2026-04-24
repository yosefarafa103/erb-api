import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const { Schema, model } = mongoose;
const tenantSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenent",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "manager", "user", "viewer"],
      default: "user",
    },

    permissions: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["active", "invited", "disabled"],
      default: "active",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    lastSeenAt: Date,
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    tenants: [tenantSchema],
    defaultTenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenent",
    },
    lastActiveTenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenent",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const UserModel = model("User", userSchema);

export default UserModel;
