import { cacheAside } from "../../helpers/cache.js";
import Sale from "./sales.model.js";
import InventoryMove from "../inventory/inventory.model.js";
import JournalEntryModel from "../journalEntries/JournalEntry.model.js";
export const createSale = async (req, res) => {
  try {
    const { items, customerId, tax = 0, discount = 0 } = req.body;
    const tenantId = req.user.lastActiveTenant;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }
    const subTotal = items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );
    const total = subTotal + tax - discount;
    const sale = await Sale.create({
      tenantId,
      customerId,
      items: items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      })),
      subTotal,
      tax,
      discount,
      total,
      createdBy: req.user._id,
    });
    const inventoryMoves = items.map((item) => ({
      tenantId,
      productId: item.productId,
      type: "out",
      quantity: item.quantity,
      reason: "sale",
      referenceType: "sale",
      referenceId: sale._id,
      unitCost: item.cost || 0,
      createdBy: req.user._id,
    }));
    await InventoryMove.insertMany(inventoryMoves);
    await JournalEntryModel.create({
      tenantId,
      reference: `SALE-${sale._id}`,
      description: "Sale invoice for customer Yosef A",
      sourceType: "sale",
      sourceId: sale._id,
      status: "posted",
      createdBy: req.user._id,
    });
    console.log(
      "sale done and add reduce product from inventory and journal entry has been created",
    );
    return res.status(201).json(sale);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getSales = async (req, res) => {
  try {
    const tenantId = req.user.lastActiveTenant;

    const sales = await cacheAside({
      key: "sales",
      ttl: 60,
      fetcher: async () =>
        await Sale.find({ tenantId }).sort({ createdAt: -1 }),
    });

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("customerId");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    sale.status = "cancelled";
    await sale.save();

    res.json({ message: "Sale cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
