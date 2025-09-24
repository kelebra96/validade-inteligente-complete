const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Dashboard principal
router.get('/', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    // Buscar dados do dashboard
    const [summaryResponse, graphsResponse, metricsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/dashboard/summary`, { headers }),
      axios.get(`${API_BASE_URL}/dashboard/graphs`, { headers }),
      axios.get(`${API_BASE_URL}/dashboard/metrics`, { headers })
    ]);
    
    res.render('dashboard/index', {
      title: 'Dashboard - Validade Inteligente',
      summary: summaryResponse.data,
      graphs: graphsResponse.data,
      metrics: metricsResponse.data,
      user: req.session.user
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error.message);
    res.render('dashboard/index', {
      title: 'Dashboard - Validade Inteligente',
      summary: {},
      graphs: {},
      metrics: {},
      user: req.session.user,
      error: 'Erro ao carregar dados do dashboard'
    });
  }
});

// Página de relatórios
router.get('/reports', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    const response = await axios.get(`${API_BASE_URL}/relatorios/dashboard`, { headers });
    
    res.render('dashboard/reports', {
      title: 'Relatórios - Validade Inteligente',
      reports: response.data,
      user: req.session.user
    });
  } catch (error) {
    console.error('Erro ao carregar relatórios:', error.message);
    res.render('dashboard/reports', {
      title: 'Relatórios - Validade Inteligente',
      reports: {},
      user: req.session.user,
      error: 'Erro ao carregar relatórios'
    });
  }
});

// Página de alertas
router.get('/alerts', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    const [alertsResponse, criticalResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/dashboard/alerts`, { headers }),
      axios.get(`${API_BASE_URL}/dashboard/critical`, { headers })
    ]);
    
    res.render('dashboard/alerts', {
      title: 'Alertas - Validade Inteligente',
      alerts: alertsResponse.data,
      critical: criticalResponse.data,
      user: req.session.user
    });
  } catch (error) {
    console.error('Erro ao carregar alertas:', error.message);
    res.render('dashboard/alerts', {
      title: 'Alertas - Validade Inteligente',
      alerts: {},
      critical: {},
      user: req.session.user,
      error: 'Erro ao carregar alertas'
    });
  }
});

module.exports = router;