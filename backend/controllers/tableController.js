import Table from "../models/Table.js";

export const createTable = async (req, res) => {
  try {
    const { columns, rows } = req.body;
    const existingTable = await Table.findOne({ userId: req.userId });
    if (existingTable) {
      res.status(400).json({ error: "Table already exists." });
    } else {
      const newTable = new Table({ columns, rows, userId: req.userId });
      await newTable.save();
      res.status(201).json(newTable);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save table data." });
  }
};

export const getTable = async (req, res) => {
  try {
    const table = await Table.find({ userId: req.userId });
    if (table.length === 0) {
      return res.status(400).json({ error: "Table not found." });
    } else {
      return res.status(200).json({ tableData: table });
    }
  } catch (error) {
    return res.status(404).json({ error: "Table not found." });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { columns, rows } = req.body;
    const table = await Table.findOne({ userId: req.userId });
    if (!table) {
      const newTable = new Table({ columns, rows, userId: req.userId });
      await newTable.save();
      return res.status(200).json(newTable);
    }
    table.columns = columns;
    return res.status(200).json(table);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update table data." });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const deletedTable = await Table.findOneAndDelete({ userId: req.userId });
    if (!deletedTable) {
      return res.status(404).json({ error: "Table not found." });
    }
    return res.status(200).json(deletedTable);
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete table data." });
  }
};
