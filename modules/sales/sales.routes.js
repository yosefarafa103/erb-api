import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
  cancelSale,
} from "./sales.controller.js";

import { isLoggedIn } from "../users/middlewares/IsLoggedIn.middlware.js";
import { verifyUser } from "../users/middlewares/verifyToken.middlware.js";

const router = express.Router();

router.use(isLoggedIn, verifyUser);
router.route("/").post(createSale).get(getSales);
router.route("/:id").get(getSaleById);
router.route("/:id/cancel").patch(cancelSale);

export default router;
