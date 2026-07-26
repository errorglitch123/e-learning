import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import {BrowserRouter} from "react-router-dom"; 
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHIABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if(!PUBLISHIABLE_KEY){
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHIABLE_KEY} afterSignOutUrl={"/"}>
      <AppProvider>
        <App />
      </AppProvider>
    </ClerkProvider>  
  </BrowserRouter>  
)
