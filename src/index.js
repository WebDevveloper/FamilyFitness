import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

// наш контекст аутентификации
import { AuthProvider } from './contexts/AuthContext';
// браузерный роутер
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
   <CssBaseline />
   <AuthProvider>
     <BrowserRouter>
       <App />
     </BrowserRouter>
   </AuthProvider>
 </ThemeProvider>
);

reportWebVitals();
