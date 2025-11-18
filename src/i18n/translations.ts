export type Language = 'uk' | 'en';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  officialRules: string;
  officialRulesTitle: string;
  ukrainian: string;
  latin: string;
  clear: string;
  copy: string;
  copyInputText: string;
  copyOutputText: string;
  swapLanguages: string;
  inputPlaceholderUk: string;
  inputPlaceholderLat: string;
  outputPlaceholderUk: string;
  outputPlaceholderLat: string;
  detectLanguage: string;
  autoDetect: string;
  translateFrom: string;
  saved: string;
  saveTranslation: string;
  savedTranslations: string;
  noSavedTranslations: string;
  deleteTranslation: string;
  clearAll: string;
  clearAllSavedTranslations: string;
  useTranslation: string;
  exportTranslations: string;
  exportSavedTranslations: string;
  exportHistory: string;
  exportAsJSON: string;
  exportAsCSV: string;
  history: string;
  translationHistory: string;
  noHistory: string;
  clearHistory: string;
  switchToUkrainian: string;
  switchToEnglish: string;
  closePanel: string;
  localStorageWarning: string;
}

export const translations: Record<Language, Translations> = {
  uk: {
    appTitle: 'Транслітерації українського алфавіту латиницею',
    appSubtitle: 'Українська ↔ Латинська',
    officialRules: 'Офіційні правила',
    officialRulesTitle: 'Офіційні правила транслітерації українського алфавіту латиницею (Постанова КМ № 55)',
    ukrainian: 'Українська',
    latin: 'Латинська',
    clear: 'Очистити',
    copy: 'Копіювати',
    copyInputText: 'Копіювати вхідний текст',
    copyOutputText: 'Копіювати транслітерований текст',
    swapLanguages: 'Поміняти мови місцями',
    inputPlaceholderUk: 'Введіть український текст...',
    inputPlaceholderLat: 'Введіть латинський текст...',
    outputPlaceholderUk: 'Транслітерований текст з\'явиться тут...',
    outputPlaceholderLat: 'Транслітерований текст з\'явиться тут...',
    detectLanguage: 'Визначити мову',
    autoDetect: 'Визначити автоматично мову',
    translateFrom: 'Перекласти з',
    saved: 'Збережені',
    saveTranslation: 'Зберегти транслітерацію',
    savedTranslations: 'Збережені транслітерації',
    noSavedTranslations: 'Немає збережених транслітерацій',
    deleteTranslation: 'Видалити',
    clearAll: 'Очистити все',
    clearAllSavedTranslations: 'Видалити всі збережені транслітерації',
    useTranslation: 'Використати',
    exportTranslations: 'Експортувати',
    exportSavedTranslations: 'Експортувати збережені транслітерації',
    exportHistory: 'Експортувати історію транслітерацій',
    exportAsJSON: 'Експортувати як JSON',
    exportAsCSV: 'Експортувати як CSV',
    history: 'Історія',
    translationHistory: 'Історія транслітерацій',
    noHistory: 'Немає історії транслітерацій',
    clearHistory: 'Очистити історію',
    switchToUkrainian: 'Перемкнути інтерфейс на українську мову',
    switchToEnglish: 'Перемкнути інтерфейс на англійську мову',
    closePanel: 'Закрити панель',
    localStorageWarning: '⚠️ Дані зберігаються тільки локально в браузері. Вони не синхронізуються з сервером і можуть бути втрачені при очищенні даних браузера.',
  },
  en: {
    appTitle: 'Transliterations of the Ukrainian alphabet into Latin',
    appSubtitle: 'Ukrainian ↔ Latin',
    officialRules: 'Official Rules',
    officialRulesTitle: 'Official Ukrainian transliteration rules (Cabinet Resolution No. 55)',
    ukrainian: 'Ukrainian',
    latin: 'Latin',
    clear: 'Clear',
    copy: 'Copy',
    copyInputText: 'Copy input text',
    copyOutputText: 'Copy transliterated text',
    swapLanguages: 'Swap languages',
    inputPlaceholderUk: 'Enter Ukrainian text...',
    inputPlaceholderLat: 'Enter Latin text...',
    outputPlaceholderUk: 'Transliterated text will appear here...',
    outputPlaceholderLat: 'Transliterated text will appear here...',
    detectLanguage: 'Detect language',
    autoDetect: 'Detect language',
    translateFrom: 'Translate from',
    saved: 'Saved',
    saveTranslation: 'Save translation',
    savedTranslations: 'Saved translations',
    noSavedTranslations: 'No saved translations',
    deleteTranslation: 'Delete',
    clearAll: 'Clear all',
    clearAllSavedTranslations: 'Delete all saved translations',
    useTranslation: 'Use',
    exportTranslations: 'Export',
    exportSavedTranslations: 'Export saved translations',
    exportHistory: 'Export translation history',
    exportAsJSON: 'Export as JSON',
    exportAsCSV: 'Export as CSV',
    history: 'History',
    translationHistory: 'Translation history',
    noHistory: 'No translation history',
    clearHistory: 'Clear history',
    switchToUkrainian: 'Switch interface to Ukrainian',
    switchToEnglish: 'Switch interface to English',
    closePanel: 'Close panel',
    localStorageWarning: '⚠️ Data is saved only locally in your browser. It is not synced to any server and may be lost if you clear your browser data.',
  },
};

