import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MapViewer from './MapViewer.jsx'

// Dev only: ?viewer opens the map viewer (type a year, see its map) instead of the game.
const viewer = import.meta.env.DEV && new URLSearchParams(location.search).has('viewer')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {viewer ? <MapViewer /> : <App />}
  </StrictMode>,
)
