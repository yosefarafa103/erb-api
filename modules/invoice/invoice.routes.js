import express from "express";
import * as controller from "./invoice.controller.js";

const router = express.Router();

router.post("/", controller.createInvoice);
router.get("/", controller.getInvoices);
router.get("/:id", controller.getInvoiceById);
router.patch("/:id", controller.updateInvoice);
router.delete("/:id", controller.deleteInvoice);

router.route("/tenents/:tenantId").get(controller.getInvoicesByTenant);

router.post("/:id/confirm", controller.confirmInvoice);

router.get("/:id/payment-status", controller.getInvoicePaymentStatus);
export default router;
