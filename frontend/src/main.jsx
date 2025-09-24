import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './components/App.jsx';
import Dashboard from './components/Dashboard.jsx';
import Relatorios from './components/Relatorios.jsx';
import IAPreditiva from './components/IAPreditiva.jsx';
import AlertasInteligentes from './components/AlertasInteligentes.jsx';
import Gamificacao from './components/Gamificacao.jsx';
import LoginForm from './components/LoginForm.jsx';
import SupportTickets from './components/Support/SupportTickets.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';
import UserManagement from './components/Admin/UserManagement.jsx';
import SystemSettings from './components/Admin/SystemSettings.jsx';
import SupportManagement from './components/Admin/SupportManagement.jsx';
import MobileDashboard from './components/Mobile/MobileDashboard.jsx';
import MobileScanner from './components/Mobile/MobileScanner.jsx';
import NewTicketForm from './components/Support/NewTicketForm.jsx';
import TicketDetail from './components/Support/TicketDetail.jsx';
import TicketRatingForm from './components/Support/TicketRatingForm.jsx';
import './index.css'; // Certifique-se de que seu arquivo CSS global está aqui
import { Toaster } from './components/ui/sonner.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/ia-preditiva" element={<IAPreditiva />} />
          <Route path="/alertas-inteligentes" element={<AlertasInteligentes />} />
          <Route path="/gamificacao" element={<Gamificacao />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/support/tickets" element={<SupportTickets />} />
          <Route path="/support/tickets/new" element={<NewTicketForm />} />
          <Route path="/support/tickets/:id" element={<TicketDetail />} />
          <Route path="/support/tickets/:id/rate" element={<TicketRatingForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
            <Route path="/admin/support" element={<SupportManagement />} />
            <Route path="/mobile" element={<MobileDashboard />} />
            <Route path="/mobile/scanner" element={<MobileScanner />} />
          {/* Adicione outras rotas aqui conforme necessário */}
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
);


