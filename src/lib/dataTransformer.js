// This function parses a line from a CSV file, handling quotes correctly.
function parseCSVLine(line, delimiter) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Cleans up individual cell values from a CSV.
function cleanCellValue(value) {
  return value.trim().replace(/^"|"$/g, "");
}

// Parses CSV content into headers and rows.
export function parseCSV(content) {
  const lines = content.trim().split("\n");
  const headers = cleanCellValue(lines[0]).split(",");
  const rows = lines.slice(1).map(line => parseCSVLine(line, ',').map(cleanCellValue));
  return { headers, rows, processedRows: rows.length, type: 'csv' };
}

// Parses JSON content into headers and rows.
export function parseJSON(content) {
  const data = JSON.parse(content);
  if (!Array.isArray(data) || data.length === 0) {
    return { headers: [], rows: [], processedRows: 0, type: 'json' };
  }
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(header => obj[header]));
  return { headers, rows, processedRows: rows.length, type: 'json' };
}

// Parses plain text content into a structured format.
export function parseText(content) {
  const lines = content.trim().split("\n");
  const headers = ["Line Number", "Content"];
  const rows = lines.map((line, index) => [index + 1, line]);
  return { headers, rows, processedRows: rows.length, type: 'text' };
}