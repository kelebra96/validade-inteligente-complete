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

// Lista de produtos
router.get('/', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    const response = await axios.get(`${API_BASE_URL}/produtos`, { headers });
    
    res.render('products/index', {
      title: 'Produtos - Validade Inteligente',
      products: response.data,
      user: req.session.user
    });
  } catch (error) {
    console.error('Erro ao carregar produtos:', error.message);
    res.render('products/index', {
      title: 'Produtos - Validade Inteligente',
      products: [],
      user: req.session.user,
      error: 'Erro ao carregar produtos'
    });
  }
});

// Formulário para adicionar produto
router.get('/add', requireAuth, (req, res) => {
  res.render('products/add', {
    title: 'Adicionar Produto - Validade Inteligente',
    user: req.session.user,
    error: req.query.error || null
  });
});

// Processar adição de produto
router.post('/add', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    const response = await axios.post(`${API_BASE_URL}/produtos`, req.body, { headers });
    
    if (response.data.success) {
      res.redirect('/products?success=' + encodeURIComponent('Produto adicionado com sucesso!'));
    } else {
      res.redirect('/products/add?error=' + encodeURIComponent('Erro ao adicionar produto'));
    }
  } catch (error) {
    console.error('Erro ao adicionar produto:', error.message);
    res.redirect('/products/add?error=' + encodeURIComponent('Erro interno do servidor'));
  }
});

// Visualizar produto específico
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const token = req.session.user.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    const response = await axios.get(`${API_BASE_URL}/produtos/${req.params.id}`, { headers });
    
    res.render('products/view', {
      title: 'Produto - Validade Inteligente',
      product: response.data,
      user: req.session.user
    });
  } catch (error) {
    console.error('Erro ao carregar produto:', error.message);
    res.redirect('/products?error=' + encodeURIComponent('Produto não encontrado'));
  }
});

module.exports = router;