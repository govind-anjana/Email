import express from "express";
import { createContact, getContacts } from "../Controller/contactController.js";


const router = express.Router();

router.post("/", createContact);
router.get("/", getContacts);

export default router;
