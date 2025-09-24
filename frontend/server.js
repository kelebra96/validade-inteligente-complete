const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'validade-inteligente-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // true em produção com HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware para disponibilizar dados da sessão nas views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  next();
});

// Importar rotas
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const productRoutes = require('./routes/products');
const settingsRoutes = require('./routes/settings');

// Usar rotas
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/products', productRoutes);
app.use('/settings', settingsRoutes);

// Rota principal - redireciona para login se não autenticado
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Erro do Servidor',
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página Não Encontrada',
    message: 'A página que você procura não existe.',
    error: {}
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor frontend rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
});

module.exports = app;