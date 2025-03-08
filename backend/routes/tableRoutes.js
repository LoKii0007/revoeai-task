
import express from "express";
import { createTable, getTable, updateTable, deleteTable } from "../controllers/tableController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createTable);
router.get("/get", authMiddleware, getTable);
router.put("/update", authMiddleware, updateTable);
router.delete("/delete", authMiddleware, deleteTable);

export default router;
