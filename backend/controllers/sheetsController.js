import { google } from "googleapis";
import dotenv from "dotenv";
import { io } from "../server.js";
dotenv.config();


const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// //? to get the sheet data from google sheets
export async function getSheetData(req, res) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1",
    });

    return res.status(200).json({sheetData: response.data.values});
  } catch (error) {
    console.error("Error fetching sheet data:", error.message);
    return res.status(500).json({error: error.message});
  } 
}


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
