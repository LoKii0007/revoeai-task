import Table from "../models/Table.js";

export const createTable = async (req, res) => {
  try {
    console.log("req.userId", req.userId);
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
      res.status(404).json({ error: "Table not found." });
    } else {
      res.status(200).json({ tableData: table });
    }
  } catch (error) {
    res.status(404).json({ error: "Table not found." });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { columns, rows } = req.body;
    const updatedTable = await Table.findOneAndUpdate(
      { userId: req.userId },
      { columns, rows },
      { new: true }
    );
    if (!updatedTable) {
      res.status(404).json({ error: "Table not found." });
    }
    res.status(200).json(updatedTable);
  } catch (error) {
    res.status(500).json({ error: "Failed to update table data." });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const deletedTable = await Table.findOneAndDelete({ userId: req.userId });
    if (!deletedTable) {
      res.status(404).json({ error: "Table not found." });
    }
    res.status(200).json(deletedTable);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete table data." });
  }
};
