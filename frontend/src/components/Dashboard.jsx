import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  LineChartComponent, 
  AreaChartComponent, 
  BarChartComponent, 
  PieChartComponent, 
  MultiLineChart,
  StackedBarChart 
} from './ui/charts';
import { MetricCard, MetricsGrid, ProgressMetric, ComparisonMetric } from './ui/metrics';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Target, 
  Award, 
  Users,
  ShoppingCart,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  Zap,
  FileText,
  Brain
} from 'lucide-react';
import apiService from '../services/api';
import ConnectivityStatus from './ConnectivityStatus';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [graphsData, setGraphsData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [criticalData, setCriticalData] = useState([]);
  const [trendsData, setTrendsData] = useState(null);
  const [produtosVencendo, setProdutosVencendo] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        dashboard, 
        summary, 
        graphs, 
        metrics, 
        alerts, 
        critical, 
        trends, 
        produtos
      ] = await Promise.all([
        apiService.getDashboard(),
        apiService.getDashboardSummary(selectedPeriod),
        apiService.getDashboardGraphs(selectedPeriod),
        apiService.getDashboardMetrics(selectedPeriod),
        apiService.getDashboardAlerts(),
        apiService.getDashboardCritical(),
        apiService.getDashboardTrends(selectedPeriod),
        apiService.getProdutosVencendo(7)
      ]);
      
      setDashboardData(dashboard);
      setSummaryData(summary);
      setGraphsData(graphs);
      setMetricsData(metrics);
      setAlertsData(alerts);
      setCriticalData(critical);
      setTrendsData(trends);
      setProdutosVencendo(produtos.produtos || []);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Formatadores
  const formatCurrency = (value) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatNumber = (value) => 
    new Intl.NumberFormat('pt-BR').format(value);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Preparar dados das métricas principais
  const mainMetrics = summaryData ? [
    {
      title: 'Total de Produtos',
      value: summaryData.total_produtos || 0,
      previousValue: summaryData.total_produtos_anterior || 0,
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Produtos Vencendo',
      value: summaryData.produtos_vencendo || 0,
      previousValue: summaryData.produtos_vencendo_anterior || 0,
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      title: 'Valor em Risco',
      value: summaryData.valor_em_risco || 0,
      previousValue: summaryData.valor_em_risco_anterior || 0,
      format: 'currency',
      icon: DollarSign,
      color: 'red'
    },
    {
      title: 'Economia do Período',
      value: summaryData.economia_periodo || 0,
      previousValue: summaryData.economia_anterior || 0,
      format: 'currency',
      icon: TrendingUp,
      color: 'green'
    }
  ] : [];

  // Preparar dados das métricas de performance
  const performanceMetrics = metricsData ? [
    {
      title: 'Taxa de Rotatividade',
      value: metricsData.taxa_rotatividade || 0,
      previousValue: metricsData.taxa_rotatividade_anterior || 0,
      format: 'percentage',
      icon: Activity,
      color: 'purple'
    },
    {
      title: 'Tempo Médio de Venda',
      value: metricsData.tempo_medio_venda || 0,
      previousValue: metricsData.tempo_medio_venda_anterior || 0,
      icon: Clock,
      color: 'indigo'
    },
    {
      title: 'Eficiência de Estoque',
      value: metricsData.eficiencia_estoque || 0,
      previousValue: metricsData.eficiencia_estoque_anterior || 0,
      format: 'percentage',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Vendas Totais',
      value: metricsData.vendas_totais || 0,
      previousValue: metricsData.vendas_totais_anterior || 0,
      format: 'currency',
      icon: ShoppingCart,
      color: 'blue'
    }
  ] : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header com Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Intuitivo</h1>
          <p className="text-gray-600 mt-1">Visão completa do seu negócio em tempo real</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/relatorios')}
            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <FileText className="w-4 h-4 mr-2" />
            Relatórios
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/ia-preditiva')}
            className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
          >
            <Brain className="w-4 h-4 mr-2" />
            IA Preditiva
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/alertas-inteligentes')}
            className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alertas Inteligentes
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/gamificacao')}
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <Award className="w-4 h-4 mr-2" />
            Gamificação
          </Button>
          
          <Button onClick={() => window.location.reload()}>
            <Zap className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Métricas Principais</h2>
        <MetricsGrid metrics={mainMetrics} columns={4} />
      </div>

      {/* Alertas Críticos */}
      {criticalData && criticalData.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Atenção!</strong> {criticalData.length} produto(s) crítico(s) detectado(s).
            <div className="mt-2 space-y-1">
              {criticalData.slice(0, 3).map((item, index) => (
                <div key={index} className="text-sm">
                  • {item.nome} - {item.motivo}
                </div>
              ))}
              {criticalData.length > 3 && (
                <div className="text-sm font-medium">
                  + {criticalData.length - 3} outros itens críticos
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Produtos Vencendo */}
      {produtosVencendo.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Calendar className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>{produtosVencendo.length} produto(s)</strong> vencendo nos próximos 7 dias.
            <div className="mt-2 space-y-1">
              {produtosVencendo.slice(0, 3).map((produto, index) => (
                <div key={index} className="text-sm">
                  • {produto.nome} - Vence em {produto.dias_para_vencer} dia(s)
                </div>
              ))}
              {produtosVencendo.length > 3 && (
                <div className="text-sm font-medium">
                  + {produtosVencendo.length - 3} outros produtos
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência de Vendas */}
        {graphsData?.vendas_tendencia && (
          <Card className="p-6">
            <LineChartComponent
              data={graphsData.vendas_tendencia}
              xKey="data"
              yKey="vendas"
              title="Tendência de Vendas"
              color="#3b82f6"
              formatter={formatCurrency}
            />
          </Card>
        )}

        {/* Produtos por Status */}
        {graphsData?.produtos_status && (
          <Card className="p-6">
            <PieChartComponent
              data={graphsData.produtos_status}
              nameKey="status"
              valueKey="quantidade"
              title="Produtos por Status"
              formatter={formatNumber}
            />
          </Card>
        )}
      </div>

      {/* Métricas de Performance */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Métricas de Performance</h2>
        <MetricsGrid metrics={performanceMetrics} columns={4} />
      </div>

      {/* Gráficos Avançados */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Análise de Categorias */}
        {graphsData?.categorias_performance && (
          <Card className="p-6">
            <BarChartComponent
              data={graphsData.categorias_performance}
              xKey="categoria"
              yKey="performance"
              title="Performance por Categoria"
              color="#10b981"
              formatter={(value) => `${value}%`}
            />
          </Card>
        )}

        {/* Evolução do Estoque */}
        {graphsData?.estoque_evolucao && (
          <Card className="p-6">
            <AreaChartComponent
              data={graphsData.estoque_evolucao}
              xKey="data"
              yKey="valor_estoque"
              title="Evolução do Valor do Estoque"
              color="#8b5cf6"
              formatter={formatCurrency}
            />
          </Card>
        )}
      </div>

      {/* Alertas e Tendências */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status dos Alertas */}
        {alertsData && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Status dos Alertas
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-red-700">Alta Urgência</span>
                <span className="text-xl font-bold text-red-600">{alertsData.alto || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-yellow-700">Média Urgência</span>
                <span className="text-xl font-bold text-yellow-600">{alertsData.medio || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-700">Baixa Urgência</span>
                <span className="text-xl font-bold text-green-600">{alertsData.baixo || 0}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Metas e Objetivos */}
        {metricsData?.metas && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Metas do Período
            </h3>
            <div className="space-y-4">
              {metricsData.metas.map((meta, index) => (
                <ProgressMetric
                  key={index}
                  title={meta.nome}
                  current={meta.atual}
                  target={meta.meta}
                  format={meta.formato}
                  color="blue"
                />
              ))}
            </div>
          </Card>
        )}

        {/* Insights e Tendências */}
        {trendsData && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Insights e Tendências
            </h3>
            <div className="space-y-3">
              {trendsData.insights?.map((insight, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{insight.texto}</p>
                  <span className="text-xs text-blue-600 font-medium">{insight.tipo}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
      
      {/* Connectivity Status */}
      <ConnectivityStatus />
    </div>
  );
};

export default Dashboard;

