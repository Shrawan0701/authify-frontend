
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './contexts/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
     <AppContextProvider>
      <App />
     </AppContextProvider>
    
  </BrowserRouter>,
)
