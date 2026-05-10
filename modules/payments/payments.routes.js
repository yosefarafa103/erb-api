import express from "express";
import {
  createPayment,
  deletePayment,
  getPaymentById,
  getPayments,
  updatePayment,
} from "./payments.controller.js";
import { postPayment } from "./payment.services.js";
const router = express.Router();

router.route("/").post(createPayment).get(getPayments);
router
  .route("/:id")
  .patch(updatePayment)
  .get(getPaymentById)
  .delete(deletePayment);
router.post("/:id/post", postPayment);

export default router;
