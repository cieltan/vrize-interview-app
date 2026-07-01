import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AiResultsPage, RESULTS_QUERY_PARAM } from './features/ai-search'

// A `?results=<query>` param (opened in a new tab from the AI chat) renders the full
// results page instead of the main store.
const resultsQuery = new URLSearchParams(window.location.search).get(RESULTS_QUERY_PARAM)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {resultsQuery !== null ? <AiResultsPage query={resultsQuery} /> : <App />}
  </StrictMode>,
)
