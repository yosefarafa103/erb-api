import Product from "./products.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, cost, quantity, sku, barcode, unit } = req.body;

    const product = await Product.create({
      tenantId: req.user.lastActiveTenant,
      name,
      price,
      cost,
      quantity,
      sku,
      barcode,
      unit,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      tenantId: req.user.lastActiveTenant,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      tenantId: req.user.lastActiveTenant,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        tenantId: req.user.lastActiveTenant,
      },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        tenantId: req.user.lastActiveTenant,
      },
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};