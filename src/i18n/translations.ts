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
  seoTitle: string;
  seoContent: string;
  seoTitle2: string;
  seoContent2: string;
  lightTheme: string;
  darkTheme: string;
  autoTheme: string;
  switchToLightTheme: string;
  switchToDarkTheme: string;
  switchToAutoTheme: string;
}

export const translations: Record<Language, Translations> = {
  uk: {
    appTitle: 'Транслітерації українського алфавіту латиницею',
    appSubtitle: 'Українська ↔ Латинська',
    officialRules: 'Правила транслітерації',
    officialRulesTitle: 'Джерело: Постанова КМУ про впорядкування транслітерації українського алфавіту латиницею',
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
    seoTitle: 'Що таке транслітерація?',
    seoContent: 'Транслітерáція — це процес перетворення тексту й окремих слів, які записані однією графічною системою чи системою писемності, засобами іншої графічної системи на основі фонетичної подібності. Інакше кажучи, передача однієї алфавітної системи писемності літерами іншої.',
    seoTitle2: 'Навіщо потрібна транслітерація українського алфавіту латиницею?',
    seoContent2: 'У зв\'язку із запровадженням визнання електронного підпису між Україною та країнами Європейського союзу виникла необхідність у транслітерації українського алфавіту латиницею з метою забезпечення сумісності міжнародних сертифікатів громадян нашої країни із інформаційними системами сфери електронних довірчих послуг країн Європейського союзу. Так, персональні дані, що містяться в сертифікатах електронного підпису (зокрема в сертифікатах, випущених за алгоритмами rsa і ecdsa), які випускаються кваліфікованими надавачами електронних довірчих послуг в Україні, вносяться символами кириличної системи, а в мовах країн Європейського союзу такі символи відсутні.',
    lightTheme: 'Світла',
    darkTheme: 'Темна',
    autoTheme: 'Авто',
    switchToLightTheme: 'Перемкнути на світлу тему',
    switchToDarkTheme: 'Перемкнути на темну тему',
    switchToAutoTheme: 'Автоматичне визначення теми',
  },
  en: {
    appTitle: 'Transliterations of the Ukrainian alphabet into Latin',
    appSubtitle: 'Ukrainian ↔ Latin',
    officialRules: 'Transliteration Rules',
    officialRulesTitle: 'Source: Resolution of the CMU on streamlining the transliteration of the Ukrainian alphabet in Latin',
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
    seoTitle: 'What is transliteration?',
    seoContent: 'In today\'s digital era, where cross-border communication and data exchange are critical, the accurate and standardized representation of personal data is essential. One important step toward this goal is transliteration — converting text or words written in one script into another, based on phonetic equivalence. In simpler terms, it means writing the letters of one alphabet using the characters of another.',
    seoTitle2: 'Why is transliteration of the Ukrainian alphabet in Latin needed?',
    seoContent2: 'With the implementation of mutual recognition of electronic signatures between Ukraine and the European Union, a need to transliterate the Ukrainian alphabet into Latin arose. This ensures that personal data in digital certificates issued by Ukrainian providers of qualified trust services can be properly recognized and processed in EU electronic trust systems. Such certificates (including those based on RSA and ECDSA algorithms) typically contain names and information written in Cyrillic, a script not used in most EU countries.',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    autoTheme: 'Auto',
    switchToLightTheme: 'Switch to light theme',
    switchToDarkTheme: 'Switch to dark theme',
    switchToAutoTheme: 'Automatic theme detection',
  },
};

