import e from "express";
import { createTenant, getTenants } from "./tenents.controller.js";

const router = e.Router();

router.route("/").post(createTenant).get(getTenants);

export default router;
