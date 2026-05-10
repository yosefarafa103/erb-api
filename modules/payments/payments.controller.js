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

export const getPayments = async (_, res) => {
  const data = await findAll();
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
