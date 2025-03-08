export const processSpreadsheetData = (data: any) => {
    if (!data.length) return { columns: [], rows: [] };
  
    // Extract column headers from the first row
    const columns = data[0].map((header: any) => ({ header, type: "text" }));
  
    // Process remaining rows into key-value pairs
    const rows = data.slice(1).map((row: any, rowIndex: any) => {
      let rowData: any = {};
      columns.forEach((col: any, colIndex: any) => {
        rowData[String.fromCharCode(65 + colIndex) + (rowIndex + 1)] = row[colIndex] || "";
      });
      return rowData;
    });
  
    return { columns, rows };
  };