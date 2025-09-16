const HISTORY_KEY = "dataflow_upload_history";
const MAX_RECORDS = 5;

export class UploadHistoryService {
  static addRecord(record) {
    const history = this.getHistory();
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      processedAt: new Date().toISOString(),
    };
    // Add the new record to the start of the list
    history.unshift(newRecord);

    // Keep only the 5 most recent records
    const trimmedHistory = history.slice(0, MAX_RECORDS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  }

  static getHistory() {
    try {
      const history = localStorage.getItem(HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  static clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
  }

  static removeRecord(id) {
    const history = this.getHistory();
    const filteredHistory = history.filter((record) => record.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
  }
}