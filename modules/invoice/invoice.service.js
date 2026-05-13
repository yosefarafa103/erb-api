import InvoiceModel from "./invoice.model.js";
import PaymentModel from "../payments/payments.model.js";

class InvoiceService {
  async create(data) {
    console.log(data);
    return await InvoiceModel.create(data);
  }

  async findAll() {
    return await InvoiceModel.find().sort({ createdAt: -1 });
  }
  async findAllByTenant(tenantId) {
    return await InvoiceModel.find({
      tenantId,
    })
      .populate("customerId")
      .sort({
        createdAt: -1,
      });
  }
  async findById(id) {
    const invoice = await InvoiceModel.findById(id);
    if (!invoice) throw new Error("Invoice not found");

    const payments = await PaymentModel.find({
      invoiceId: invoice._id,
    });

    return { invoice, payments };
  }

  async update(id, data) {
    const invoice = await InvoiceModel.findById(id);
    if (!invoice) throw new Error("Invoice not found");

    if (invoice.status !== "draft") {
      throw new Error("Cannot update confirmed invoice");
    }

    Object.assign(invoice, data);
    await invoice.save();

    return invoice;
  }

  async delete(id) {
    const invoice = await InvoiceModel.findById(id);
    if (!invoice) throw new Error("Invoice not found");

    if (invoice.status !== "draft") {
      throw new Error("Cannot delete confirmed invoice");
    }

    await InvoiceModel.findByIdAndDelete(id);
    return { message: "Deleted" };
  }

  async confirm(id) {
    const invoice = await InvoiceModel.findById(id);
    if (!invoice) throw new Error("Invoice not found");

    if (invoice.status !== "draft") {
      throw new Error("Already confirmed");
    }

    invoice.status = "confirmed";
    await invoice.save();
    return invoice;
  }

  async calculatePaymentStatus(invoiceId) {
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    const payments = await PaymentModel.find({
      invoiceId: invoice._id,
    });

    const paid = payments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = invoice.total - paid;

    let status = "unpaid";
    if (paid > 0 && paid < invoice.total) status = "partial";
    if (paid === invoice.total) status = "paid";

    return { paid, remaining, status, total: invoice.total };
  }
}

export async function getInvoicePaymentDetails(invoiceId) {
  const invoice = await InvoiceModel.findById(invoiceId);
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  const payments = await PaymentModel.aggregate([
    {
      $match: {
        invoiceId: new Types.ObjectId(invoiceId),
        status: "posted",
        direction: "in",
      },
    },
    {
      $group: {
        _id: "$invoiceId",
        paidAmount: {
          $sum: "$amount",
        },
        payments: {
          $push: {
            _id: "$_id",
            amount: "$amount",
            method: "$method",
            reference: "$reference",
            description: "$description",
            createdAt: "$createdAt",
            status: "$status",
          },
        },
      },
    },
  ]);

  const paidAmount = payments[0]?.paidAmount || 0;

  const remainingAmount = invoice.total - paidAmount;

  return {
    invoiceTotal: invoice.total,
    paidAmount,
    remainingAmount,
    payments: payments[0]?.payments || [],
    isPaid: remainingAmount <= 0,
  };
}

export default new InvoiceService();
