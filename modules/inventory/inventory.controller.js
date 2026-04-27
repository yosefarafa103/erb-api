import InventoryMove from "./inventory.model"
export async function createInventory(req, res) {
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
  const inventoryMove = await InventoryMove.create({
    
  })
}
