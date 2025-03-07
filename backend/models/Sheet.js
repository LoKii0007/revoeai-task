import mongoose from "mongoose";

const sheetDataSchema = new mongoose.Schema({
  sheetId: String,
  sheetName: String,
  data: mongoose.Schema.Types.Mixed,
  lastUpdated: { type: Date, default: Date.now }
})

const SheetData = mongoose.model("SheetData", sheetDataSchema);

export default SheetData;
