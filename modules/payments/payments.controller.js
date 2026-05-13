import {
  create,
  findAll,
  findById,
  update,
  remove,
} from "./payment.services.js";

export const createPayment = async (req, res) => {
  const payment = await create(req.body);
  res.json(payment);
};

export const getPayments = async (req, res) => {
  const tenentId = req.query.tenentId;
  if (!tenentId)
    return res.status(400).json({
      err: true,
      message: "tenentId is missing",
    });
  const data = await findAll(tenentId);
  res.json(data);
};

export const getPaymentById = async (req, res) => {
  const data = await findById(req.params.id);
  res.json(data);
};

export const updatePayment = async (req, res) => {
  const data = await update(req.params.id, req.body);
  res.json(data);
};

export const deletePayment = async (req, res) => {
  await remove(req.params.id);
  res.json({ message: "Deleted" });
};
