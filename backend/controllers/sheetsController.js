import { google } from "googleapis";
import dotenv from "dotenv";
import SheetData from "../models/Sheet.js";
import { io } from "../server.js";
dotenv.config();

// const auth = new google.auth.GoogleAuth({
//   credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });


// //? to get the sheet data from google sheets
// async function fetchSheetData(spreadsheetId, range) {
//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//     });

//     return response.data.values;
//   } catch (error) {
//     console.error('Error fetching sheet data:', error);
//     throw error;
//   }
// }

// Function to update database with latest sheet data
export async function updateSheetData(req, res) {
  try {
    const { range, values, sheetName } = req.body;

    console.log(`Update received for ${sheetName}, range: ${range}`);

    // Send real-time update to clients
    io.emit("sheetDataUpdated", {
      sheetName,
      data: values,
      updatedRange: range,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error handling sheet update:", error);
    res.status(500).json({ error: error.message });
  }
}

export const getSheetData = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { range } = req.query;

    const sheetData = await SheetData.findOne({ sheetId });

    if (sheetData) {
      return res.json({
        data: sheetData.data,
        lastUpdated: sheetData.lastUpdated,
      });
    }

    // If not in database, fetch it
    const data = await updateSheetData(sheetId, range || "Sheet1");
    res.json({ data, lastUpdated: new Date() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
