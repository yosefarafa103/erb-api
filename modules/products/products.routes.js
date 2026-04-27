import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./products.controller.js";

import { isLoggedIn } from "../users/middlewares/IsLoggedIn.middlware.js";
import { verifyUser } from "../users/middlewares/verifyToken.middlware.js";

const router = express.Router();

router.use(isLoggedIn, verifyUser);

router.route("/").post(createProduct).get(getProducts);

router
  .route("/:id")
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;
