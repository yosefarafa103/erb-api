import e from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addUserToTenant,
  switchTenant,
  getUsersByTenant,
} from "./users.controller.js";
import { signup, login, getCurrentUser, logout } from "./auth.controller.js";
import { isLoggedIn } from "./middlewares/IsLoggedIn.middlware.js";
import { verifyUser } from "./middlewares/verifyToken.middlware.js";
const router = e.Router();

router.route("/").get(getUsers);
router.post("/login", login);
router.post("/logout", logout);
router.route("/get-me").get(isLoggedIn, verifyUser, getCurrentUser);
router.post("/signup", signup);
router.route("/get-tenant-users").get(getUsersByTenant);
router.route("/add-to-tenant").post(addUserToTenant);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.route("/switch-tenant").post(isLoggedIn, verifyUser, switchTenant);
export default router;
