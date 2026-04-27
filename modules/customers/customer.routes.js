import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "./customer.controller.js";

import { isLoggedIn } from "../users/middlewares/IsLoggedIn.middlware.js";
import { verifyUser } from "../users/middlewares/verifyToken.middlware.js";

const router = express.Router();

router.use(isLoggedIn, verifyUser);
router.route("/").post(createCustomer).get(getCustomers);

router
  .route("/:id")
  .get(getCustomerById)
  .patch(updateCustomer)
  .delete(deleteCustomer);

export default router;
