import Customer from "./customer.model.js";

export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const customer = await Customer.create({
      tenantId: req.user.lastActiveTenant,
      name,
      email,
      phone,
      address,
      createdBy: req.user._id,
    });

    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({
      tenantId: req.user.lastActiveTenant,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      tenantId: req.user.lastActiveTenant,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        tenantId: req.user.lastActiveTenant,
      },
      req.body,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        tenantId: req.user.lastActiveTenant,
      },
      { isActive: false },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};