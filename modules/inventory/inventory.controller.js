import InventoryMove from "./inventory.model.js";

export async function createInventory(req, res) {
  try {
    const {
      tenantId,
      productId,
      type,
      quantity,
      reason,
      referenceType,
      referenceId,
      unitCost,
      createdBy,
    } = req.body;
    const lastMoves = await InventoryMove.findOne({
      tenantId,
      productId,
    });
    let finalReason = reason;
    let finalType = type;
    if (!lastMoves) {
      finalReason = "opening_stock";
      finalType = "in";
    }
    const inventoryMove = await InventoryMove.create({
      tenantId,
      productId,
      type: finalType,
      quantity,
      reason: finalReason,
      referenceType: lastMoves ? referenceType : null,
      referenceId: lastMoves ? referenceId : null,
      unitCost,
      createdBy,
    });
    return res.json({
      data: inventoryMove,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}
export const getInventoryHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const tenantId = req.user.lastActiveTenant;
    const history = await InventoryMove.find({
      productId,
      tenantId,
    }).sort({ createdAt: -1 });

    return res.json(history);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
