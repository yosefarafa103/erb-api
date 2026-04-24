import { cacheAside } from "../../helpers/cache.js";
import User from "./users.model.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, tenantId, role, tenants } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      tenants,
      role,
      defaultTenant: tenantId,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { tenantId } = req.query;
    const users = await cacheAside({
      key: "users",
      fetcher: async () => await User.find().select("-password"),
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const user = await User.findOne({
      _id: req.params.id,
      "tenants.tenantId": tenantId,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { tenantId } = req;
    const updates = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        "tenants.tenantId": tenantId,
      },
      updates,
      { new: true },
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { tenantId } = req;

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        "tenants.tenantId": tenantId,
      },
      {
        $set: {
          "tenants.$.status": "disabled",
        },
      },
      { new: true },
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User disabled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addUserToTenant = async (req, res) => {
  try {
    const { userId, tenantId, role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          tenants: {
            tenantId,
            role,
            status: "active",
          },
        },
      },
      { new: true },
    );

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUsersByTenant = async (req, res) => {
  try {
    const { tenantId } = req.query;
    const users = await User.find({
      tenants: {
        $elemMatch: {
          tenantId,
          status: "active",
        },
      },
    })
      // .populate("tenants.tenantId")
      .select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const switchTenant = async (req, res) => {
  try {
    const { tenantId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const hasAccess = user.tenants.some(
      (t) => t.tenantId.toString() === tenantId && t.status === "active",
    );
    if (!hasAccess) return res.status(403).json({ message: "Access denied" });
    user.lastActiveTenant = tenantId;
    await user.save();
    res.json({ message: "Tenant switched" });
  } catch (err) {
    console.log(err, err.stack, err.message);

    res.status(500).json({ message: err.message });
  }
};
