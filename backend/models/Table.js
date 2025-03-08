import mongoose from "mongoose";

const ColumnSchema = new mongoose.Schema({
  header: { type: String, required: true },
  type: { type: String, required: true },
});

const RowSchema = new mongoose.Schema({}, { strict: false });

const TableSchema = new mongoose.Schema(
  {
    columns: { type: [ColumnSchema], required: true },
    rows: { type: [RowSchema], required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", TableSchema);

export default Table;
