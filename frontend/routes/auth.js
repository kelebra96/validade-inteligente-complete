const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

// Página de login
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  
  res.render('auth/login', {
    title: 'Login - Validade Inteligente',
    error: req.query.error || null,
    success: req.query.success || null
  });
});

// Processar login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.success) {
      req.session.user = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        token: response.data.token
      };
      
      res.redirect('/dashboard');
    } else {
      res.redirect('/auth/login?error=' + encodeURIComponent('Credenciais inválidas'));
    }
  } catch (error) {
    console.error('Erro no login:', error.message);
    res.redirect('/auth/login?error=' + encodeURIComponent('Erro interno do servidor'));
  }
});

// Página de registro
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  
  res.render('auth/register', {
    title: 'Criar Conta - Validade Inteligente',
    error: req.query.error || null
  });
});

// Processar registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      return res.redirect('/auth/register?error=' + encodeURIComponent('Senhas não coincidem'));
    }
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      email,
      password
    });
    
    if (response.data.success) {
      res.redirect('/auth/login?success=' + encodeURIComponent('Conta criada com sucesso! Faça login.'));
    } else {
      res.redirect('/auth/register?error=' + encodeURIComponent(response.data.message || 'Erro ao criar conta'));
    }
  } catch (error) {
    console.error('Erro no registro:', error.message);
    res.redirect('/auth/register?error=' + encodeURIComponent('Erro interno do servidor'));
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;