import express from "express";
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  reverseJournalEntry,
} from "./JournalEntry.controller.js";

import { isLoggedIn } from "../users/middlewares/IsLoggedIn.middlware.js";
import { verifyUser } from "../users/middlewares/verifyToken.middlware.js";

const router = express.Router();

router.use(isLoggedIn, verifyUser);

router.route("/").post(createJournalEntry).get(getJournalEntries);

router.route("/:id").get(getJournalEntryById);

router.route("/:id/reverse").post(reverseJournalEntry);

export default router;
