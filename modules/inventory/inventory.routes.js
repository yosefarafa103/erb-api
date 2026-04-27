import express from "express";
import {
  createInventory,
  getInventoryHistory,
} from "./inventory.controller.js";
import { isLoggedIn } from "../users/middlewares/IsLoggedIn.middlware.js";
import { verifyUser } from "../users/middlewares/verifyToken.middlware.js";

const router = express.Router();
router.use(isLoggedIn, verifyUser);
router.route("/").post(createInventory);
router.route("/:productId").get(getInventoryHistory);
export default router;
