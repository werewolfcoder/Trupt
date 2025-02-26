import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './context/UserContext.jsx'
import OrgContext from './context/UserContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <OrgContext>
   <UserContext>
    <BrowserRouter>
      <App />
    </BrowserRouter>
      </UserContext>
   </OrgContext>
  </StrictMode>,
)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
