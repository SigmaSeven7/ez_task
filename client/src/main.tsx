import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
       <ErrorBoundary>
    <AppProvider>
      <App />
    </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
);