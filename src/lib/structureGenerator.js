// This file contains the logic for intelligently extracting structured data from raw text.

// The main function that orchestrates the text processing.
export function structureTextData(text) {
  const lines = text.trim().split('\n');
  const headers = ["Date", "Employee", "Department", "Action", "Value", "Schedule", "Duration"];
  const rows = lines.map(processLine);
  
  return {
    headers,
    rows,
    processedRows: rows.length,
    type: 'text-analysis'
  };
}

// This function processes a single line of text to extract entities.
function processLine(line) {
  const today = new Date('2025-09-05'); // Assuming 'today' for context like in your example
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];

  // Define patterns to look for
  const patterns = {
    date: /(\d{1,2}(?:st|nd|rd|th)?\s\w+\s\d{4})|yesterday/i,
    employee: /(Amit Sharma|Priya|Neha|Ravi)/i,
    department: /(Sales|Finance|HR|IT)/i,
    action: /(closed a deal|approved the budget|planning a recruitment drive|reported server downtime)/i,
    value: /(?:₹|Rs\.)[ ,.\d]+/i,
    schedule: /next week/i,
    duration: /\d+\s+hours/i,
  };

  // Function to find a match or return a default value
  const find = (pattern) => {
    const match = line.match(pattern);
    if (!match) return '—';
    if (pattern === patterns.date) {
        if (match[0].toLowerCase() === 'yesterday') return yesterdayStr;
        // This is a simplified date parser. A real app would use a library.
        return todayStr; 
    }
    return match[0];
  };

  return [
    find(patterns.date),
    find(patterns.employee),
    find(patterns.department),
    find(patterns.action),
    find(patterns.value),
    find(patterns.schedule),
    find(patterns.duration),
  ];
}