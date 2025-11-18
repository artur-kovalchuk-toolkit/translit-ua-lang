export interface SavedTranslation {
  id: string;
  inputText: string;
  outputText: string;
  direction: 'uk-to-lat' | 'lat-to-uk';
  timestamp: number;
}

const STORAGE_KEY = 'translit-saved-translations';

export function getSavedTranslations(): SavedTranslation[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as SavedTranslation[];
  } catch (e) {
    console.warn('Failed to load saved translations:', e);
    return [];
  }
}

export function saveTranslation(translation: Omit<SavedTranslation, 'id' | 'timestamp'>): SavedTranslation {
  const savedTranslations = getSavedTranslations();
  
  // Check if this translation already exists
  const existing = savedTranslations.find(
    t => t.inputText === translation.inputText && 
         t.outputText === translation.outputText &&
         t.direction === translation.direction
  );

  if (existing) {
    return existing; // Return existing if already saved
  }

  const newTranslation: SavedTranslation = {
    ...translation,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
  };

  const updated = [newTranslation, ...savedTranslations];
  
  // Limit to 100 saved translations
  const limited = updated.slice(0, 100);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (e) {
    console.warn('Failed to save translation:', e);
  }

  return newTranslation;
}

export function deleteSavedTranslation(id: string): void {
  const savedTranslations = getSavedTranslations();
  const filtered = savedTranslations.filter(t => t.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to delete translation:', e);
  }
}

export function clearAllSavedTranslations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear saved translations:', e);
  }
}

export function isTranslationSaved(inputText: string, outputText: string, direction: 'uk-to-lat' | 'lat-to-uk'): boolean {
  const savedTranslations = getSavedTranslations();
  return savedTranslations.some(
    t => t.inputText === inputText && 
         t.outputText === outputText &&
         t.direction === direction
  );
}

export function exportSavedTranslationsAsJSON(): string {
  const savedTranslations = getSavedTranslations();
  return JSON.stringify(savedTranslations, null, 2);
}

export function exportSavedTranslationsAsCSV(): string {
  const savedTranslations = getSavedTranslations();
  
  // CSV header
  const headers = ['Input Text', 'Output Text', 'Direction', 'Date'];
  const rows = savedTranslations.map(t => {
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

export function downloadFile(content: string, filename: string, mimeType: string): void {
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

export function exportSavedTranslations(format: 'json' | 'csv' = 'json'): void {
  const savedTranslations = getSavedTranslations();
  
  if (savedTranslations.length === 0) {
    return;
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (format === 'json') {
    const jsonContent = exportSavedTranslationsAsJSON();
    downloadFile(jsonContent, `translit-saved-${timestamp}.json`, 'application/json');
  } else {
    const csvContent = exportSavedTranslationsAsCSV();
    downloadFile(csvContent, `translit-saved-${timestamp}.csv`, 'text/csv');
  }
}

