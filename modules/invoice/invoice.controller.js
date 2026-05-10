import InvoiceModel from "./invoice.model.js";
import invoiceService from "./invoice.service.js";

export const createInvoice = async (req, res) => {
  try {
    const data = await invoiceService.create(req.body);
    console.log("DOC CREATED");

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const data = await invoiceService.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const data = await invoiceService.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const data = await invoiceService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const data = await invoiceService.delete(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const confirmInvoice = async (req, res) => {
  try {
    const data = await invoiceService.confirm(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getInvoicePaymentStatus = async (req, res) => {
  try {
    const data = await invoiceService.calculatePaymentStatus(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getInvoicesByTenant = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId || req.params.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant ID is required",
      });
    }
    const invoices = await invoiceService.findAllByTenant(tenantId);
    res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
