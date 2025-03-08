import express from "express";
import { updateSheetData, getSheetData } from "../controllers/sheetsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/update", updateSheetData);
router.get("/", authMiddleware, getSheetData);

export default router;
