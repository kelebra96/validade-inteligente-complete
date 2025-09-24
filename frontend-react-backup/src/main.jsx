import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SimpleApp from './components/SimpleApp.jsx';
import SimpleLoginForm from './components/SimpleLoginForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import Demo from './components/Demo.jsx';
import Sobre from './components/Sobre.jsx';
import Contato from './components/Contato.jsx';
import TesteGratuito from './components/TesteGratuito.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SimpleApp />} />
          <Route path="/login" element={<SimpleLoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/teste-gratuito" element={<TesteGratuito />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);


