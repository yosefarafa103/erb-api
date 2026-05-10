import mongoose from "mongoose";
import PaymentModel from "./payments.model.js";
export const generateJournalEntry = async (payment) => {
  let lines = [];

  if (payment.direction === "in") {
    lines = [
      {
        accountId: payment.method === "cash" ? "MAIN_CASH" : "BANK_ACCOUNT",
        debit: payment.amount,
        credit: 0,
      },
      {
        accountId: "ACCOUNTS_RECEIVABLE",
        debit: 0,
        credit: payment.amount,
      },
    ];
  } else {
    lines = [
      {
        accountId: "ACCOUNTS_PAYABLE",
        debit: payment.amount,
        credit: 0,
      },
      {
        accountId: payment.method === "cash" ? "MAIN_CASH" : "BANK_ACCOUNT",
        debit: 0,
        credit: payment.amount,
      },
    ];
  }

  return {
    description: payment.description,
    date: new Date(),
    lines,
  };
};

export const postPayment = async (req, res) => {
  const payment = await findById(req.params.id);

  if (!payment) throw new Error("Payment not found");
  if (payment.status === "posted") throw new Error("Already posted");

  const journal = await generateJournalEntry(payment);
  payment.status = "posted";
  await payment.save();
  res.json({ payment, journal });
};

export const create = async (data) => {
  const payment = await PaymentModel.create(data);
  return payment;
};

export const findAll = async () => {
  return await PaymentModel.find().sort({ createdAt: -1 });
};

export const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }

  const payment = await PaymentModel.findById(id);
  if (!payment) throw new Error("Payment not found");

  return payment;
};
export const update = async (id, data) => {
  const payment = await PaymentModel.findById(id);

  if (!payment) throw new Error("Payment not found");

  if (payment.status === "posted") {
    throw new Error("Cannot update posted payment");
  }

  Object.assign(payment, data);

  await payment.save();

  return payment;
};

export const remove = async (id) => {
  const payment = await PaymentModel.findById(id);

  if (!payment) throw new Error("Payment not found");

  if (payment.status === "posted") {
    throw new Error("Cannot delete posted payment");
  }

  await PaymentModel.findByIdAndDelete(id);
};

export const post = async (id) => {
  const payment = await PaymentModel.findById(id);

  if (!payment) throw new Error("Payment not found");

  if (payment.status === "posted") {
    throw new Error("Already posted");
  }

  const journal = await generateJournalEntry(payment);

  payment.status = "posted";
  await payment.save();

  return { payment, journal };
};
