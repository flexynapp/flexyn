import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

if (import.meta.env.DEV) {
  import('./lib/i18n-check').then(({ checkI18nCompleteness }) => {
    setTimeout(checkI18nCompleteness, 100);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)