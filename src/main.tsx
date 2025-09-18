import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        success: {
          style: {
            background: "#10B981",
            color: "white",
          },
          iconTheme: {
            primary: "white",
            secondary: "#10B981",
          },
        },
        error: {
          style: {
            background: "#EF4444",
            color: "white",
          },
          iconTheme: {
            primary: "white",
            secondary: "#EF4444",
          },
        },
      }}
    />

  </StrictMode>,
)
