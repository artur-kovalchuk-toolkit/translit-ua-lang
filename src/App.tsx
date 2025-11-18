import { useState, useEffect, useRef } from 'react'
import './App.css'
import { transliterateUkrainianToLatin, transliterateLatinToUkrainian, detectLanguage } from './utils/transliterate'
import { useLanguage } from './i18n/LanguageContext'
import { 
  getSavedTranslations, 
  saveTranslation, 
  deleteSavedTranslation, 
  clearAllSavedTranslations,
  isTranslationSaved,
  exportSavedTranslations,
  type SavedTranslation 
} from './utils/savedTranslations'
import {
  getTranslationHistory,
  addToHistory,
  deleteHistoryItem,
  clearHistory,
  exportHistory,
  type HistoryItem
} from './utils/translationHistory'

type Direction = 'uk-to-lat' | 'lat-to-uk'
type SourceLanguageMode = 'auto' | 'ukrainian' | 'latin'

function App() {
  const { t, language, setLanguage } = useLanguage()
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [direction, setDirection] = useState<Direction>('uk-to-lat')
  const [copiedInput, setCopiedInput] = useState(false)
  const [copiedOutput, setCopiedOutput] = useState(false)
  const [sourceLanguageMode, setSourceLanguageMode] = useState<SourceLanguageMode>('auto')
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [savedTranslations, setSavedTranslations] = useState<SavedTranslation[]>([])
  const [showSavedPanel, setShowSavedPanel] = useState(false)
  const [isCurrentSaved, setIsCurrentSaved] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)
  const [showHistoryExportDropdown, setShowHistoryExportDropdown] = useState(false)
  const [showSeoAccordion, setShowSeoAccordion] = useState(false)
  const [showSeoAccordion2, setShowSeoAccordion2] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const exportDropdownRef = useRef<HTMLDivElement>(null)
  const historyExportDropdownRef = useRef<HTMLDivElement>(null)
  const lastSavedHistoryRef = useRef<{ inputText: string; outputText: string; direction: Direction } | null>(null)
  const historyDebounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-detect language when in auto mode
  useEffect(() => {
    if (sourceLanguageMode === 'auto' && inputText.trim() !== '') {
      const detected = detectLanguage(inputText)
      if (detected === 'ukrainian') {
        setDirection('uk-to-lat')
      } else if (detected === 'latin') {
        setDirection('lat-to-uk')
      }
    } else if (sourceLanguageMode === 'ukrainian') {
      setDirection('uk-to-lat')
    } else if (sourceLanguageMode === 'latin') {
      setDirection('lat-to-uk')
    }
  }, [inputText, sourceLanguageMode])

  // Update output text based on direction
  useEffect(() => {
    if (inputText.trim() === '') {
      setOutputText('')
      return
    }

    if (direction === 'uk-to-lat') {
      setOutputText(transliterateUkrainianToLatin(inputText))
    } else {
      setOutputText(transliterateLatinToUkrainian(inputText))
    }
  }, [inputText, direction])

  // Load saved translations and history on mount
  useEffect(() => {
    setSavedTranslations(getSavedTranslations())
    setHistoryItems(getTranslationHistory())
  }, [])

  // Update document title based on language
  useEffect(() => {
    document.title = t.appTitle
  }, [t.appTitle, language])

  // Smart history saving strategy
  const saveToHistoryIfNeeded = () => {
    const trimmedInput = inputText.trim()
    const trimmedOutput = outputText.trim()
    
    // Don't save if:
    // - Input or output is empty
    // - Input is too short (less than 2 characters)
    // - This is the same as the last saved translation
    if (!trimmedInput || !trimmedOutput || trimmedInput.length < 2) {
      return
    }
    
    const currentTranslation = {
      inputText: trimmedInput,
      outputText: trimmedOutput,
      direction,
    }
    
    // Check if this is different from the last saved one
    if (lastSavedHistoryRef.current &&
        lastSavedHistoryRef.current.inputText === currentTranslation.inputText &&
        lastSavedHistoryRef.current.outputText === currentTranslation.outputText &&
        lastSavedHistoryRef.current.direction === currentTranslation.direction) {
      return // Already saved this exact translation
    }
    
    // Save to history
    addToHistory(currentTranslation)
    lastSavedHistoryRef.current = currentTranslation
    setHistoryItems(getTranslationHistory())
  }

  // Debounced save: only save after user stops typing for 2 seconds
  useEffect(() => {
    // Clear previous timer
    if (historyDebounceTimerRef.current) {
      clearTimeout(historyDebounceTimerRef.current)
    }
    
    // Only set timer if we have meaningful content
    if (inputText.trim().length >= 2 && outputText.trim()) {
      historyDebounceTimerRef.current = setTimeout(() => {
        saveToHistoryIfNeeded()
      }, 2000) // Wait 2 seconds after user stops typing
    }
    
    return () => {
      if (historyDebounceTimerRef.current) {
        clearTimeout(historyDebounceTimerRef.current)
      }
    }
  }, [inputText, outputText, direction])

  // Save to history when user copies output (they're using it)
  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputText)
    setCopiedOutput(true)
    setTimeout(() => setCopiedOutput(false), 2000)
    
    // Save to history when user copies (indicates they're using the translation)
    saveToHistoryIfNeeded()
  }

  // Save to history when input loses focus (user finished editing)
  const handleInputBlur = () => {
    saveToHistoryIfNeeded()
  }

  // Check if current translation is saved
  useEffect(() => {
    if (inputText.trim() && outputText.trim()) {
      setIsCurrentSaved(isTranslationSaved(inputText, outputText, direction))
    } else {
      setIsCurrentSaved(false)
    }
  }, [inputText, outputText, direction])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false)
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false)
      }
      if (historyExportDropdownRef.current && !historyExportDropdownRef.current.contains(event.target as Node)) {
        setShowHistoryExportDropdown(false)
      }
    }

    if (showLanguageDropdown || showExportDropdown || showHistoryExportDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLanguageDropdown, showExportDropdown, showHistoryExportDropdown])

  const handleSwap = () => {
    // Save current translation to history before swapping
    if (inputText.trim() && outputText.trim()) {
      saveToHistoryIfNeeded()
    }
    
    const temp = inputText
    setInputText(outputText)
    setOutputText(temp)
    setDirection(direction === 'uk-to-lat' ? 'lat-to-uk' : 'uk-to-lat')
    // Reset to auto-detect after swap
    setSourceLanguageMode('auto')
    // Reset last saved ref since we're swapping
    lastSavedHistoryRef.current = null
  }

  const handleLanguageSelect = (mode: SourceLanguageMode) => {
    setSourceLanguageMode(mode)
    setShowLanguageDropdown(false)
    
    if (mode === 'ukrainian') {
      setDirection('uk-to-lat')
    } else if (mode === 'latin') {
      setDirection('lat-to-uk')
    }
  }

  const getSourceLanguageLabel = () => {
    if (sourceLanguageMode === 'auto') {
      const detected = detectLanguage(inputText)
      if (detected === 'ukrainian') {
        return t.ukrainian
      } else if (detected === 'latin') {
        return t.latin
      }
      return t.autoDetect
    } else if (sourceLanguageMode === 'ukrainian') {
      return t.ukrainian
    } else {
      return t.latin
    }
  }

  const handleCopyInput = () => {
    navigator.clipboard.writeText(inputText)
    setCopiedInput(true)
    setTimeout(() => setCopiedInput(false), 2000)
  }


  const handleClear = () => {
    // Save current translation to history before clearing
    if (inputText.trim() && outputText.trim()) {
      saveToHistoryIfNeeded()
    }
    
    setInputText('')
    setOutputText('')
    setSourceLanguageMode('auto')
    lastSavedHistoryRef.current = null
  }

  const handleSaveTranslation = () => {
    if (!inputText.trim() || !outputText.trim()) {
      return
    }

    if (isCurrentSaved) {
      // If already saved, find and delete it
      const saved = savedTranslations.find(
        t => t.inputText === inputText && 
             t.outputText === outputText &&
             t.direction === direction
      )
      if (saved) {
        deleteSavedTranslation(saved.id)
        setSavedTranslations(getSavedTranslations())
        setIsCurrentSaved(false)
      }
    } else {
      // Save the translation
      saveTranslation({
        inputText,
        outputText,
        direction,
      })
      setSavedTranslations(getSavedTranslations())
      setIsCurrentSaved(true)
    }
  }

  const handleDeleteSaved = (id: string) => {
    deleteSavedTranslation(id)
    setSavedTranslations(getSavedTranslations())
    // Update isCurrentSaved if we deleted the current translation
    if (inputText.trim() && outputText.trim()) {
      setIsCurrentSaved(isTranslationSaved(inputText, outputText, direction))
    }
  }

  const handleUseSaved = (translation: SavedTranslation) => {
    // Save current translation before loading saved one
    if (inputText.trim() && outputText.trim()) {
      saveToHistoryIfNeeded()
    }
    
    setInputText(translation.inputText)
    setOutputText(translation.outputText)
    setDirection(translation.direction)
    setSourceLanguageMode(translation.direction === 'uk-to-lat' ? 'ukrainian' : 'latin')
    setShowSavedPanel(false)
    // Reset last saved ref since we're loading a different translation
    lastSavedHistoryRef.current = null
  }

  const handleClearAllSaved = () => {
    if (window.confirm(language === 'uk' 
      ? 'Ви впевнені, що хочете видалити всі збережені транслітерації?'
      : 'Are you sure you want to delete all saved translations?')) {
      clearAllSavedTranslations()
      setSavedTranslations([])
      setIsCurrentSaved(false)
    }
  }

  const handleExport = (format: 'json' | 'csv') => {
    exportSavedTranslations(format)
    setShowExportDropdown(false)
  }

  const handleDeleteHistory = (id: string) => {
    deleteHistoryItem(id)
    setHistoryItems(getTranslationHistory())
  }

  const handleUseHistory = (item: HistoryItem) => {
    // Save current translation before loading history one
    if (inputText.trim() && outputText.trim()) {
      saveToHistoryIfNeeded()
    }
    
    setInputText(item.inputText)
    setOutputText(item.outputText)
    setDirection(item.direction)
    setSourceLanguageMode(item.direction === 'uk-to-lat' ? 'ukrainian' : 'latin')
    setShowHistoryPanel(false)
    // Set last saved ref to the loaded item (it's already in history)
    lastSavedHistoryRef.current = {
      inputText: item.inputText,
      outputText: item.outputText,
      direction: item.direction,
    }
  }

  const handleClearHistory = () => {
    if (window.confirm(language === 'uk' 
      ? 'Ви впевнені, що хочете очистити всю історію?'
      : 'Are you sure you want to clear all history?')) {
      clearHistory()
      setHistoryItems([])
    }
  }

  const handleExportHistory = (format: 'json' | 'csv') => {
    exportHistory(format)
    setShowHistoryExportDropdown(false)
  }

  return (
    <div className={`app ${showHistoryPanel || showSavedPanel ? 'panel-open' : ''}`}>
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">{t.appTitle}</h1>
            <a 
              href="https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF#Text" 
              target="_blank" 
              rel="noopener noreferrer"
              className="official-link"
              title={t.officialRulesTitle}
            >
              {t.officialRules}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
          <div className="header-actions">
            <div className="language-switcher">
              <button
                className={`lang-button ${language === 'uk' ? 'active' : ''}`}
                onClick={() => setLanguage('uk')}
                aria-label={t.switchToUkrainian}
                title={t.switchToUkrainian}
              >
                УКР
              </button>
              <button
                className={`lang-button ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                aria-label={t.switchToEnglish}
                title={t.switchToEnglish}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="translator-container">
        <div className="translator-panel">
          <div className="language-header">
            <div className="language-selector-container" ref={dropdownRef}>
              <button
                className={`language-selector-button ${showLanguageDropdown ? 'dropdown-open' : ''}`}
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                aria-label={t.translateFrom}
                title={t.translateFrom}
              >
                <span className="language-selector-label">
                  {sourceLanguageMode === 'auto' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="auto-detect-icon">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  )}
                  {getSourceLanguageLabel()}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-arrow">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {showLanguageDropdown && (
                <div className="language-dropdown">
                  <button
                    className={`language-option ${sourceLanguageMode === 'auto' ? 'active' : ''}`}
                    onClick={() => handleLanguageSelect('auto')}
                    aria-label={t.autoDetect}
                    title={t.autoDetect}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    {t.autoDetect}
                  </button>
                  <button
                    className={`language-option ${sourceLanguageMode === 'ukrainian' ? 'active' : ''}`}
                    onClick={() => handleLanguageSelect('ukrainian')}
                    aria-label={t.ukrainian}
                    title={t.ukrainian}
                  >
                    {t.ukrainian}
                  </button>
                  <button
                    className={`language-option ${sourceLanguageMode === 'latin' ? 'active' : ''}`}
                    onClick={() => handleLanguageSelect('latin')}
                    aria-label={t.latin}
                    title={t.latin}
                  >
                    {t.latin}
                  </button>
                </div>
              )}
            </div>
            <button 
              className="clear-button" 
              onClick={handleClear}
              aria-label={t.clear}
              title={t.clear}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-area-container">
            <textarea
              ref={inputTextareaRef}
              className="text-area"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onBlur={handleInputBlur}
              placeholder={
                sourceLanguageMode === 'auto' 
                  ? (inputText.trim() === '' ? t.inputPlaceholderUk : (direction === 'uk-to-lat' ? t.inputPlaceholderUk : t.inputPlaceholderLat))
                  : (direction === 'uk-to-lat' ? t.inputPlaceholderUk : t.inputPlaceholderLat)
              }
              rows={10}
            />
            {inputText && (
              <button
                className="copy-button"
                onClick={handleCopyInput}
                aria-label={t.copyInputText}
                title={t.copyInputText}
              >
                {copiedInput ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="swap-container">
          <button
            className="swap-button"
            onClick={handleSwap}
            aria-label={t.swapLanguages}
            title={t.swapLanguages}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        <div className="translator-panel">
          <div className="language-header">
            <span className="language-label">
              {direction === 'uk-to-lat' ? t.latin : t.ukrainian}
            </span>
          </div>
          <div className="text-area-container">
            <textarea
              className="text-area output"
              value={outputText}
              readOnly
              placeholder={direction === 'uk-to-lat' ? t.outputPlaceholderLat : t.outputPlaceholderUk}
              rows={10}
            />
            {outputText && (
              <>
                <button
                  className={`save-button ${isCurrentSaved ? 'saved' : ''}`}
                  onClick={handleSaveTranslation}
                  aria-label={t.saveTranslation}
                  title={t.saveTranslation}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isCurrentSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
                <button
                  className="copy-button"
                  onClick={handleCopyOutput}
                  aria-label={t.copyOutputText}
                  title={t.copyOutputText}
                >
                  {copiedOutput ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* History and Saved buttons - centered below translator */}
      <div className="history-saved-buttons-container">
        <button
          className={`history-saved-button history-button ${showHistoryPanel ? 'active' : ''}`}
          onClick={() => {
            setShowHistoryPanel(!showHistoryPanel)
            if (showHistoryPanel) {
              setShowSavedPanel(false)
            }
          }}
          aria-label={t.history}
          title={t.history}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="history-saved-button-label">{t.history}</span>
          {historyItems.length > 0 && (
            <span className="history-saved-count">{historyItems.length}</span>
          )}
        </button>
        <button
          className={`history-saved-button saved-button ${showSavedPanel ? 'active' : ''}`}
          onClick={() => {
            setShowSavedPanel(!showSavedPanel)
            if (showSavedPanel) {
              setShowHistoryPanel(false)
            }
          }}
          aria-label={t.saved}
          title={t.saved}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={showSavedPanel ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="history-saved-button-label">{t.saved}</span>
          {savedTranslations.length > 0 && (
            <span className="history-saved-count">{savedTranslations.length}</span>
          )}
        </button>
      </div>

      {/* SEO Accordion Section */}
      <div className="seo-accordion-container">
        <button
          className={`seo-accordion-button ${showSeoAccordion ? 'active' : ''}`}
          onClick={() => setShowSeoAccordion(!showSeoAccordion)}
          aria-expanded={showSeoAccordion}
          aria-label={t.seoTitle}
        >
          <span className="seo-accordion-title">{t.seoTitle}</span>
          <svg
            className={`seo-accordion-icon ${showSeoAccordion ? 'open' : ''}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {showSeoAccordion && (
          <div className="seo-accordion-content">
            <div className="seo-content-text">
              <p>{t.seoContent}</p>
            </div>
          </div>
        )}
      </div>

      {/* SEO Accordion Section 2 */}
      <div className="seo-accordion-container">
        <button
          className={`seo-accordion-button ${showSeoAccordion2 ? 'active' : ''}`}
          onClick={() => setShowSeoAccordion2(!showSeoAccordion2)}
          aria-expanded={showSeoAccordion2}
          aria-label={t.seoTitle2}
        >
          <span className="seo-accordion-title">{t.seoTitle2}</span>
          <svg
            className={`seo-accordion-icon ${showSeoAccordion2 ? 'open' : ''}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {showSeoAccordion2 && (
          <div className="seo-accordion-content">
            <div className="seo-content-text">
              <p>{t.seoContent2}</p>
            </div>
          </div>
        )}
      </div>

      {showSavedPanel && (
        <>
          <div className="saved-panel-backdrop" onClick={() => setShowSavedPanel(false)} />
          <div className="saved-panel">
          <div className="saved-panel-header">
            <h2>{t.savedTranslations}</h2>
            <div className="saved-panel-actions">
              {savedTranslations.length > 0 && (
                <>
                  <div className="export-dropdown-container" ref={exportDropdownRef}>
                    <button
                      className={`export-button ${showExportDropdown ? 'dropdown-open' : ''}`}
                      onClick={() => setShowExportDropdown(!showExportDropdown)}
                      aria-label={t.exportSavedTranslations}
                      title={t.exportSavedTranslations}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-arrow-small">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {showExportDropdown && (
                      <div className="export-dropdown">
                        <button
                          className="export-option"
                          onClick={() => handleExport('json')}
                          aria-label={t.exportAsJSON}
                          title={t.exportAsJSON}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7h16M4 12h16M4 17h16" />
                          </svg>
                          {t.exportAsJSON}
                        </button>
                        <button
                          className="export-option"
                          onClick={() => handleExport('csv')}
                          aria-label={t.exportAsCSV}
                          title={t.exportAsCSV}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          {t.exportAsCSV}
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    className="clear-all-button"
                    onClick={handleClearAllSaved}
                    aria-label={t.clearAllSavedTranslations}
                    title={t.clearAllSavedTranslations}
                  >
                    {t.clearAll}
                  </button>
                </>
              )}
              <button
                className="close-saved-button"
                onClick={() => setShowSavedPanel(false)}
                aria-label={t.closePanel}
                title={t.closePanel}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="saved-panel-content">
            <div className="local-storage-warning">
              <p>{t.localStorageWarning}</p>
            </div>
            {savedTranslations.length === 0 ? (
              <div className="no-saved-translations">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <p>{t.noSavedTranslations}</p>
              </div>
            ) : (
              <div className="saved-translations-list">
                {savedTranslations.map((translation) => (
                  <div key={translation.id} className="saved-translation-item">
                    <div className="saved-translation-content">
                      <div className="saved-translation-text">
                        <div className="saved-input">
                          <span className="saved-label">{translation.direction === 'uk-to-lat' ? t.ukrainian : t.latin}</span>
                          <p>{translation.inputText}</p>
                        </div>
                        <div className="saved-output">
                          <span className="saved-label">{translation.direction === 'uk-to-lat' ? t.latin : t.ukrainian}</span>
                          <p>{translation.outputText}</p>
                        </div>
                      </div>
                      <div className="saved-translation-actions">
                        <button
                          className="use-button"
                          onClick={() => handleUseSaved(translation)}
                          aria-label={t.useTranslation}
                          title={t.useTranslation}
                        >
                          {t.useTranslation}
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteSaved(translation.id)}
                          aria-label={t.deleteTranslation}
                          title={t.deleteTranslation}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </>
      )}

      {showHistoryPanel && (
        <>
          <div className="saved-panel-backdrop" onClick={() => setShowHistoryPanel(false)} />
          <div className="saved-panel">
          <div className="saved-panel-header">
            <h2>{t.translationHistory}</h2>
            <div className="saved-panel-actions">
              {historyItems.length > 0 && (
                <>
                  <div className="export-dropdown-container" ref={historyExportDropdownRef}>
                    <button
                      className={`export-button ${showHistoryExportDropdown ? 'dropdown-open' : ''}`}
                      onClick={() => setShowHistoryExportDropdown(!showHistoryExportDropdown)}
                      aria-label={t.exportHistory}
                      title={t.exportHistory}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-arrow-small">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {showHistoryExportDropdown && (
                      <div className="export-dropdown">
                        <button
                          className="export-option"
                          onClick={() => handleExportHistory('json')}
                          aria-label={t.exportAsJSON}
                          title={t.exportAsJSON}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7h16M4 12h16M4 17h16" />
                          </svg>
                          {t.exportAsJSON}
                        </button>
                        <button
                          className="export-option"
                          onClick={() => handleExportHistory('csv')}
                          aria-label={t.exportAsCSV}
                          title={t.exportAsCSV}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          {t.exportAsCSV}
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    className="clear-all-button"
                    onClick={handleClearHistory}
                    aria-label={t.clearHistory}
                    title={t.clearHistory}
                  >
                    {t.clearHistory}
                  </button>
                </>
              )}
              <button
                className="close-saved-button"
                onClick={() => setShowHistoryPanel(false)}
                aria-label={t.closePanel}
                title={t.closePanel}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="saved-panel-content">
            <div className="local-storage-warning">
              <p>{t.localStorageWarning}</p>
            </div>
            {historyItems.length === 0 ? (
              <div className="no-saved-translations">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <p>{t.noHistory}</p>
              </div>
            ) : (
              <div className="saved-translations-list">
                {historyItems.map((item) => (
                  <div key={item.id} className="saved-translation-item">
                    <div className="saved-translation-content">
                      <div className="saved-translation-text">
                        <div className="saved-input">
                          <span className="saved-label">{item.direction === 'uk-to-lat' ? t.ukrainian : t.latin}</span>
                          <p>{item.inputText}</p>
                        </div>
                        <div className="saved-output">
                          <span className="saved-label">{item.direction === 'uk-to-lat' ? t.latin : t.ukrainian}</span>
                          <p>{item.outputText}</p>
                        </div>
                      </div>
                      <div className="saved-translation-actions">
                        <button
                          className="use-button"
                          onClick={() => handleUseHistory(item)}
                          aria-label={t.useTranslation}
                          title={t.useTranslation}
                        >
                          {t.useTranslation}
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteHistory(item.id)}
                          aria-label={t.deleteTranslation}
                          title={t.deleteTranslation}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </>
      )}

      <footer className="app-footer">
        <a
          href="https://github.com/artur-kovalchuk-toolkit/translit-ua-lang"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          aria-label="GitHub Repository"
          title="View on GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </a>
      </footer>
    </div>
  )
}

export default App
