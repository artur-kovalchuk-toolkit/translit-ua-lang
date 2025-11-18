import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useParams } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext.tsx'
import { ThemeProvider } from './i18n/ThemeContext.tsx'
import { ErrorBoundary } from './ErrorBoundary.tsx'

function RootRedirect() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang');
  
  // If no lang parameter, redirect to default (uk)
  if (!lang) {
    return <Navigate to="/?lang=uk" replace />;
  }
  
  // If lang parameter exists, render the app
  return (
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  );
}

function LanguagePathRedirect() {
  const { lang } = useParams<{ lang: string }>();
  
  // Validate and redirect to query parameter format
  if (lang === 'en' || lang === 'uk') {
    return <Navigate to={`/?lang=${lang}`} replace />;
  }
  
  // If invalid language, redirect to default
  return <Navigate to="/?lang=uk" replace />;
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename="/translit-ua-lang">
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/:lang" element={<LanguagePathRedirect />} />
          <Route path="*" element={<Navigate to="/?lang=uk" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
