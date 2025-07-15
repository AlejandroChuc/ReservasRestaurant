import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GlobalReservationsProvider } from './context/GlobalReservationsContext';
import { ReservationProvider } from './context/ReservationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalReservationsProvider>
      <ReservationProvider>
        <App />
      </ReservationProvider>
    </GlobalReservationsProvider>
  </React.StrictMode>,
)
