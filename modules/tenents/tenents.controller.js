import TenentModel from "./tenents.model.js";

export const createTenant = async (req, res) => {
  try {
    const {
      name,
      domain,
      ownerId,
      plan,
      settings,
      features,
      billing,
      metadata,
    } = req.body;

    const tenant = await TenentModel.create({
      name,
      domain,
      ownerId,
      plan,
      settings,
      features,
      billing,
      metadata,
    });

    res.status(201).json(tenant);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const getTenants = async (req, res) => {
  try {
    const tenants = await TenentModel.find().sort({ createdAt: -1 });

    res.status(200).json(tenants);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
