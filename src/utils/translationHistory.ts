export interface HistoryItem {
  id: string;
  inputText: string;
  outputText: string;
  direction: 'uk-to-lat' | 'lat-to-uk';
  timestamp: number;
}

const STORAGE_KEY = 'translit-translation-history';
const MAX_HISTORY_ITEMS = 100;

export function getTranslationHistory(): HistoryItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as HistoryItem[];
  } catch (e) {
    console.warn('Failed to load translation history:', e);
    return [];
  }
}

export function addToHistory(translation: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
  const history = getTranslationHistory();
  
  // Check if this exact translation already exists (avoid duplicates)
  const existing = history.find(
    t => t.inputText === translation.inputText && 
         t.outputText === translation.outputText &&
         t.direction === translation.direction
  );

  if (existing) {
    // Move to top if it already exists
    const filtered = history.filter(t => t.id !== existing.id);
    const updated = [existing, ...filtered];
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update history:', e);
    }
    
    return existing;
  }

  const newItem: HistoryItem = {
    ...translation,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
  };

  // Add to beginning and limit to MAX_HISTORY_ITEMS
  const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save to history:', e);
  }

  return newItem;
}

export function deleteHistoryItem(id: string): void {
  const history = getTranslationHistory();
  const filtered = history.filter(t => t.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to delete history item:', e);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear history:', e);
  }
}

export function exportHistoryAsJSON(): string {
  const history = getTranslationHistory();
  return JSON.stringify(history, null, 2);
}

export function exportHistoryAsCSV(): string {
  const history = getTranslationHistory();
  
  // CSV header
  const headers = ['Input Text', 'Output Text', 'Direction', 'Date'];
  const rows = history.map(t => {
    const date = new Date(t.timestamp).toISOString();
    const direction = t.direction === 'uk-to-lat' ? 'Ukrainian → Latin' : 'Latin → Ukrainian';
    
    // Escape CSV values (handle quotes and commas)
    const escapeCSV = (value: string): string => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };
    
    return [
      escapeCSV(t.inputText),
      escapeCSV(t.outputText),
      escapeCSV(direction),
      escapeCSV(date)
    ].join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
}

export function exportHistory(format: 'json' | 'csv' = 'json'): void {
  const history = getTranslationHistory();
  
  if (history.length === 0) {
    return;
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (format === 'json') {
    const jsonContent = exportHistoryAsJSON();
    downloadFile(jsonContent, `translit-history-${timestamp}.json`, 'application/json');
  } else {
    const csvContent = exportHistoryAsCSV();
    downloadFile(csvContent, `translit-history-${timestamp}.csv`, 'text/csv');
  }
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

