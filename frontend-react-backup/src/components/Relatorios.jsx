import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Package,
  DollarSign,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import apiService from '../services/api';
import { LineChartComponent, BarChartComponent, PieChartComponent, AreaChartComponent } from './ui/charts';

const Relatorios = () => {
  const [activeTab, setActiveTab] = useState('vendas');
  const [loading, setLoading] = useState(false);
  const [relatorioData, setRelatorioData] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({
    data_inicio: '',
    data_fim: '',
    categoria: '',
    periodo: '30d'
  });

  // Carregar categorias disponíveis
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const response = await apiService.getCategoriasRelatorio();
        if (response.success) {
          setCategorias(response.categorias);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    loadCategorias();
  }, []);

  // Carregar relatório baseado na aba ativa
  useEffect(() => {
    loadRelatorio();
  }, [activeTab]);

  const loadRelatorio = async () => {
    setLoading(true);
    try {
      let response;
      
      switch (activeTab) {
        case 'vendas':
          response = await apiService.getRelatorioVendas(filtros);
          break;
        case 'perdas':
          response = await apiService.getRelatorioPerdas(filtros);
          break;
        case 'estoque':
          response = await apiService.getRelatorioEstoque(filtros);
          break;
        case 'performance':
          response = await apiService.getRelatorioPerformance(filtros.periodo);
          break;
        default:
          return;
      }
      
      if (response.success) {
        setRelatorioData(response.relatorio);
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const aplicarFiltros = () => {
    loadRelatorio();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const exportarRelatorio = (formato) => {
    // Implementar exportação em diferentes formatos
    console.log(`Exportando relatório em formato ${formato}`);
  };

  const tabs = [
    { id: 'vendas', label: 'Vendas', icon: TrendingUp },
    { id: 'perdas', label: 'Perdas', icon: TrendingDown },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'performance', label: 'Performance', icon: BarChart3 }
  ];

  const renderFiltros = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activeTab !== 'performance' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={filtros.data_inicio}
                onChange={(e) => handleFiltroChange('data_inicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={filtros.data_fim}
                onChange={(e) => handleFiltroChange('data_fim', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={filtros.categoria}
                onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as categorias</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        
        {activeTab === 'performance' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={filtros.periodo}
              onChange={(e) => handleFiltroChange('periodo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
            </select>
          </div>
        )}
        
        <div className="flex items-end">
          <button
            onClick={aplicarFiltros}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );

  const renderResumo = () => {
    if (!relatorioData?.resumo) return null;

    const { resumo } = relatorioData;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {activeTab === 'vendas' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(resumo.totais.valor_total_vendas)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quantidade Vendida</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(resumo.totais.quantidade_total_vendida)}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Número de Vendas</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatNumber(resumo.totais.numero_vendas)}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(resumo.medias.valor_medio_venda)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'perdas' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total Perdas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(resumo.totais.valor_total_perdas)}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quantidade Perdida</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatNumber(resumo.totais.quantidade_total_perdas)}
                  </p>
                </div>
                <Package className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Perdidos</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatNumber(resumo.totais.produtos_perdidos)}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'estoque' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor do Estoque</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(resumo.totais.valor_total_estoque)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumber(resumo.totais.produtos_ativos)}
                  </p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Vencendo</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatNumber(resumo.totais.produtos_vencendo)}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Vencidos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatNumber(resumo.totais.produtos_vencidos)}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'performance' && relatorioData.kpis && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Crescimento de Vendas</p>
                  <p className={`text-2xl font-bold ${relatorioData.kpis.vendas.crescimento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(relatorioData.kpis.vendas.crescimento)}
                  </p>
                </div>
                {relatorioData.kpis.vendas.crescimento >= 0 ? 
                  <TrendingUp className="w-8 h-8 text-green-600" /> :
                  <TrendingDown className="w-8 h-8 text-red-600" />
                }
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Rotatividade</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPercentage(relatorioData.kpis.rotatividade.taxa)}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Perda</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatPercentage(relatorioData.kpis.perdas.taxa)}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(relatorioData.kpis.ticket_medio.valor)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderGraficos = () => {
    if (!relatorioData?.graficos) return null;

    const { graficos } = relatorioData;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {activeTab === 'vendas' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Vendas por Dia
              </h3>
              <LineChartComponent 
                data={graficos.vendas_por_dia}
                xKey="data"
                yKey="valor"
                color="#3B82F6"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Vendas por Categoria
              </h3>
              <PieChartComponent 
                data={graficos.vendas_por_categoria}
                dataKey="valor"
                nameKey="categoria"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top 10 Produtos
              </h3>
              <BarChartComponent 
                data={graficos.top_produtos}
                xKey="produto"
                yKey="valor"
                color="#10B981"
              />
            </div>
          </>
        )}
        
        {activeTab === 'perdas' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Perdas por Categoria
              </h3>
              <PieChartComponent 
                data={graficos.perdas_por_categoria}
                dataKey="valor"
                nameKey="categoria"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Perdas por Mês
              </h3>
              <BarChartComponent 
                data={graficos.perdas_por_mes}
                xKey="mes"
                yKey="valor"
                color="#EF4444"
              />
            </div>
          </>
        )}
        
        {activeTab === 'estoque' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Estoque por Categoria
              </h3>
              <PieChartComponent 
                data={graficos.estoque_por_categoria}
                dataKey="valor"
                nameKey="categoria"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estoque por Status
              </h3>
              <BarChartComponent 
                data={graficos.estoque_por_status}
                xKey="status"
                yKey="valor"
                color="#8B5CF6"
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios Completos</h1>
          <p className="text-gray-600 mt-2">
            Análise detalhada de vendas, perdas, estoque e performance
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => exportarRelatorio('pdf')}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => exportarRelatorio('excel')}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filtros */}
      {renderFiltros()}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Conteúdo do Relatório */}
      {!loading && relatorioData && (
        <>
          {/* Resumo */}
          {renderResumo()}
          
          {/* Gráficos */}
          {renderGraficos()}
          
          {/* Tabela de Dados */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dados Detalhados
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {activeTab === 'vendas' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Total
                        </th>
                      </>
                    )}
                    
                    {activeTab === 'perdas' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Validade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade Perdida
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Perda
                        </th>
                      </>
                    )}
                    
                    {activeTab === 'estoque' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Estoque
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeTab === 'vendas' && relatorioData.vendas?.slice(0, 10).map((venda, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {venda.data_venda}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {venda.produto_nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {venda.categoria || 'Sem categoria'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(venda.quantidade_vendida)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(venda.valor_total)}
                      </td>
                    </tr>
                  ))}
                  
                  {activeTab === 'perdas' && relatorioData.perdas?.slice(0, 10).map((perda, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {perda.produto_nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {perda.categoria || 'Sem categoria'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {perda.data_validade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(perda.quantidade_perdida)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {formatCurrency(perda.valor_perda)}
                      </td>
                    </tr>
                  ))}
                  
                  {activeTab === 'estoque' && relatorioData.estoque?.slice(0, 10).map((produto, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {produto.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {produto.categoria || 'Sem categoria'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(produto.quantidade)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          produto.status === 'ativo' ? 'bg-green-100 text-green-800' :
                          produto.status === 'vencendo' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {produto.status === 'ativo' ? 'Ativo' :
                           produto.status === 'vencendo' ? 'Vencendo' : 'Vencido'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(produto.valor_estoque)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Relatorios;