class ApiService {
  constructor() {
    this.baseURL = '/api';
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken();
          window.location.href = '/login';
        }
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}${queryString ? '?' + queryString : ''}`;
    return this.request(url);
  }

  // Autenticação
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Produtos
  async getProdutos(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/produtos${queryString ? '?' + queryString : ''}`);
  }

  async createProduto(produtoData) {
    return this.request('/produtos', {
      method: 'POST',
      body: JSON.stringify(produtoData),
    });
  }

  async getProduto(id) {
    return this.request(`/produtos/${id}`);
  }

  async updateProduto(id, produtoData) {
    return this.request(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(produtoData),
    });
  }

  async deleteProduto(id) {
    return this.request(`/produtos/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategorias() {
    return this.request('/produtos/categorias');
  }

  async getProdutosVencendo(dias = 7) {
    return this.request(`/produtos/vencendo?dias=${dias}`);
  }

  async registrarVenda(produtoId, vendaData) {
    return this.request(`/produtos/${produtoId}/venda`, {
      method: 'POST',
      body: JSON.stringify(vendaData),
    });
  }

  // Alertas
  async getAlertas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/alertas${queryString ? '?' + queryString : ''}`);
  }

  async resolverAlerta(alertaId, resolucaoData) {
    return this.request(`/alertas/${alertaId}/resolver`, {
      method: 'POST',
      body: JSON.stringify(resolucaoData),
    });
  }

  // IA e Sugestões
  async getSugestoes() {
    return this.request('/ia/sugestoes');
  }

  async treinarIA() {
    return this.request('/ia/treinar', {
      method: 'POST',
    });
  }

  // Relatórios
  async getDashboard(periodo = '30d') {
    return this.request(`/relatorios/dashboard?periodo=${periodo}`);
  }

  async getDashboardSummary(period = '30d') {
    return this.request(`/dashboard/summary?period=${period}`);
  }

  async getDashboardGraphs(period = '30d') {
    return this.request(`/dashboard/graphs?period=${period}`);
  }

  async getDashboardMetrics(period = '30d') {
    return this.request(`/dashboard/metrics?period=${period}`);
  }

  async getDashboardAlerts() {
    return this.request('/dashboard/alerts');
  }

  async getDashboardCritical() {
    return this.request('/dashboard/critical');
  }

  async getDashboardTrends(period = '30d') {
    return this.request(`/dashboard/trends?period=${period}`);
  }

  async getRelatoriosPerdas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/relatorios/perdas${queryString ? '?' + queryString : ''}`);
  }

  async getRelatorioVendas(filtros = {}) {
    const queryString = new URLSearchParams(filtros).toString();
    return this.request(`/relatorios/vendas${queryString ? '?' + queryString : ''}`);
  }

  async getRelatorioPerdas(filtros = {}) {
    const queryString = new URLSearchParams(filtros).toString();
    return this.request(`/relatorios/perdas${queryString ? '?' + queryString : ''}`);
  }

  async getRelatorioEstoque(filtros = {}) {
    const queryString = new URLSearchParams(filtros).toString();
    return this.request(`/relatorios/estoque${queryString ? '?' + queryString : ''}`);
  }

  async getRelatorioPerformance(periodo = '30d') {
    return this.request(`/relatorios/performance?periodo=${periodo}`);
  }

  async getCategoriasRelatorio() {
    return this.request('/relatorios/categorias');
  }

  // Métodos para IA Preditiva
  async getPrevisaoDemanda(filtros = {}) {
    return this.get('/previsao-demanda', filtros);
  }

  async getAnaliseSazonalidade() {
    return this.get('/analise-sazonalidade');
  }

  async getRecomendacoesInteligentes(tipo = 'geral') {
    return this.get('/recomendacoes-inteligentes', { tipo });
  }

  async getAnaliseTendencias() {
    return this.get('/analise-tendencias');
  }

  // Métodos para Alertas Inteligentes
  async getAlertasAtivos(filtros = {}) {
    return this.get('/alertas-ativos', filtros);
  }

  async getConfiguracaoAlertas() {
    return this.get('/configuracoes-alertas');
  }

  async atualizarConfiguracaoAlertas(configuracoes) {
    return this.request('/configuracoes-alertas', {
      method: 'PUT',
      body: JSON.stringify(configuracoes),
    });
  }

  async resolverAlerta(alertaId, dados) {
    return this.request(`/resolver-alerta/${alertaId}`, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  async getEstatisticasAlertas(periodo = '30d') {
    return this.get('/estatisticas-alertas', { periodo });
  }

  // Gamificação
  async getRanking() {
    return this.get('/ranking');
  }

  async getPerfilUsuario(usuarioId) {
    return this.get(`/perfil/${usuarioId}`);
  }

  async getBadges() {
    return this.get('/badges');
  }

  async getDesafios() {
    return this.get('/desafios');
  }

  async adicionarPontos(usuarioId, pontos, acao) {
    return this.request('/adicionar-pontos', {
      method: 'POST',
      body: JSON.stringify({
        usuario_id: usuarioId,
        pontos: pontos,
        acao: acao
      })
    });
  }

  async completarDesafio(desafioId) {
    return this.request(`/completar-desafio/${desafioId}`, {
      method: 'POST'
    });
  }

  async getEstatisticasGerais() {
    return this.get('/estatisticas-gerais');
  }

  // Gamificação
  async getGamificacao() {
    return this.request('/gamificacao/perfil');
  }

  async getMetas() {
    return this.request('/gamificacao/metas');
  }

  async createMeta(metaData) {
    return this.request('/gamificacao/metas', {
      method: 'POST',
      body: JSON.stringify(metaData),
    });
  }

  // Utilitários
  isAuthenticated() {
    return !!this.token;
  }

  logout() {
    this.removeToken();
    window.location.href = '/';
  }
}

export default new ApiService();

