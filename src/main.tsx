import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/bricolage-grotesque/wdth.css'
import '@fontsource-variable/figtree'
import '@fontsource-variable/caveat'
import '@fontsource/kalam/devanagari-400.css'
import '@fontsource/kalam/400.css'
import './index.css'
import App from './App'
import { StoreProvider } from './state/store'

// the router layout handles scroll position on navigation
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
