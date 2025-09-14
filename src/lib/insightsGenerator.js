// This file contains the logic to generate specific insights from structured data.

export function generateInsightsFromData(jsonData) {
  const insights = [];

  // 1. Customer Feedback Analysis
  if (jsonData.customer_feedback && Array.isArray(jsonData.customer_feedback)) {
    insights.push({
      title: "Customer Feedback (Sentiment Analysis)",
      headers: ["Feedback", "Sentiment"],
      rows: jsonData.customer_feedback.map(feedback => [feedback, analyzeSentiment(feedback)]),
      summary: "Sentiment analysis helps you quickly gauge customer opinions."
    });
  }

  // 2. Employee Log Timeline
  if (jsonData.employee_logs && Array.isArray(jsonData.employee_logs)) {
    insights.push({
      title: "Employee Logs (Timeline View)",
      headers: ["Time", "Event"],
      rows: jsonData.employee_logs.map(log => {
        const parts = log.split(' - ');
        return [parts[0], parts.slice(1).join(' - ')];
      }),
      summary: "This timeline shows system usage and errors chronologically."
    });
  }

  // 3. Sales Data Aggregation
  if (jsonData.sales_data && Array.isArray(jsonData.sales_data)) {
    let totalRevenue = 0;
    const salesRows = jsonData.sales_data.map(sale => {
      const price = parseFloat(String(sale.price).replace('$', ''));
      const total = sale.quantity * price;
      totalRevenue += total;
      return [sale.order_id, sale.item, sale.quantity, `$${price.toFixed(2)}`, `$${total.toFixed(2)}`];
    });
    salesRows.push(['Total Revenue', '—', '—', '—', `$${totalRevenue.toFixed(2)}`]);
    insights.push({
      title: "Sales Data (With Totals)",
      headers: ["Order ID", "Item", "Quantity", "Price", "Total"],
      rows: salesRows,
      summary: `You instantly see total revenue = $${totalRevenue.toFixed(2)}.`
    });
  }

  // 4. Emails Log
  if (jsonData.emails && Array.isArray(jsonData.emails)) {
    insights.push({
      title: "Emails (Communication Log)",
      headers: ["From", "Subject", "Body (short)"],
      rows: jsonData.emails.map(email => [email.from, email.subject, email.body.substring(0, 30) + '...']),
      summary: "Gives a quick view of business communication."
    });
  }

  // 5. Nested User Profile
  if (jsonData.nested_data && jsonData.nested_data.user) {
    const flattened = flattenObject(jsonData.nested_data);
    insights.push({
      title: "Nested User Profile (User Info)",
      headers: ["User ID", "Name", "Location", "Preferred Language", "Theme Preference"],
      rows: [[
        flattened['user.id'],
        flattened['user.profile.name'],
        flattened['user.profile.location'],
        flattened['user.profile.preferences.language'],
        flattened['user.profile.preferences.theme']
      ]],
      summary: "Shows user personalization details."
    });
  }

  return insights;
}

// Helper function for sentiment analysis
function analyzeSentiment(text) {
  const positiveWords = ["great", "amazing", "fast", "recommend", "helpful"];
  const negativeWords = ["late", "confusing", "errors"];
  const lowerText = String(text).toLowerCase();

  for (const word of negativeWords) {
    if (lowerText.includes(word)) return "Negative";
  }
  for (const word of positiveWords) {
    if (lowerText.includes(word)) return "Positive";
  }
  return "Neutral";
}

// Helper to flatten objects
function flattenObject(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const propName = parentKey ? parentKey + '.' + key : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], propName, result);
      } else {
        result[propName] = obj[key];
      }
    }
  }
  return result;
}