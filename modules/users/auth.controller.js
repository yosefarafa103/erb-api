import User from "./users.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signup = async (req, res) => {
  try {
    const { name, email, password, tenantId } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      tenants: tenantId
        ? [
            {
              tenantId: new mongoose.Types.ObjectId(tenantId),
              role: "owner",
              status: "active",
            },
          ]
        : [],
      lastActiveTenant: tenantId,
      defaultTenant: tenantId,
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Cannot find your email",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    return res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        user,
        token,
      });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    return res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        message: "Logged out successfully",
      });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
export const getCurrentUser = (req, res, next) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return next(error.message);
  }
};
