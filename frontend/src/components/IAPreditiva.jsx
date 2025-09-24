import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { LineChartComponent, BarChartComponent, PieChartComponent, AreaChartComponent } from './ui/charts';
import { MetricCard, MetricsGrid } from './ui/metrics';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Zap,
  ArrowLeft,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';
import apiService from '../services/api';

const IAPreditiva = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('previsao');
  const [loading, setLoading] = useState(false);
  const [previsaoData, setPrevisaoData] = useState(null);
  const [sazonalidadeData, setSazonalidadeData] = useState(null);
  const [recomendacoesData, setRecomendacoesData] = useState(null);
  const [tendenciasData, setTendenciasData] = useState(null);
  const [filtros, setFiltros] = useState({
    periodo: '30d',
    categoria: '',
    tipo_recomendacao: 'geral'
  });

  // Carregar dados baseado na aba ativa
  useEffect(() => {
    loadData();
  }, [activeTab, filtros]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'previsao':
          const previsao = await apiService.getPrevisaoDemanda(filtros);
          if (previsao.success) {
            setPrevisaoData(previsao);
          }
          break;
        case 'sazonalidade':
          const sazonalidade = await apiService.getAnaliseSazonalidade();
          if (sazonalidade.success) {
            setSazonalidadeData(sazonalidade);
          }
          break;
        case 'recomendacoes':
          const recomendacoes = await apiService.getRecomendacoesInteligentes(filtros.tipo_recomendacao);
          if (recomendacoes.success) {
            setRecomendacoesData(recomendacoes);
          }
          break;
        case 'tendencias':
          const tendencias = await apiService.getAnaliseTendencias();
          if (tendencias.success) {
            setTendenciasData(tendencias);
          }
          break;
      }
    } catch (error) {
      console.error('Erro ao carregar dados da IA:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTendenciaIcon = (tendencia) => {
    switch (tendencia) {
      case 'crescente': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrescente': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const renderPrevisaoDemanda = () => {
    if (!previsaoData) return null;

    const metricas = [
      {
        title: 'Produtos Analisados',
        value: previsaoData.estatisticas.total_produtos_analisados,
        icon: BarChart3,
        color: 'blue'
      },
      {
        title: 'Risco de Ruptura',
        value: previsaoData.estatisticas.produtos_risco_ruptura,
        icon: AlertTriangle,
        color: 'red'
      },
      {
        title: 'Tendência Crescente',
        value: previsaoData.estatisticas.produtos_tendencia_crescente,
        icon: TrendingUp,
        color: 'green'
      },
      {
        title: 'Acurácia Média',
        value: `${previsaoData.estatisticas.acuracia_media}%`,
        icon: Target,
        color: 'purple'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Métricas */}
        <MetricsGrid metrics={metricas} columns={4} />

        {/* Gráfico de Previsões */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Previsão de Demanda - Próximos 7 Dias</h3>
          <LineChartComponent
            data={previsaoData.produtos.slice(0, 10).map(p => ({
              nome: p.nome,
              atual: p.vendas_mes_atual,
              previsto: p.previsao_proximos_7_dias,
              confianca: p.confianca_previsao
            }))}
            xKey="nome"
            yKey="previsto"
            title="Demanda Prevista"
            height={300}
          />
        </Card>

        {/* Lista de Produtos */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Análise Detalhada por Produto</h3>
          <div className="space-y-4">
            {previsaoData.produtos.slice(0, 8).map((produto) => (
              <div key={produto.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{produto.nome}</h4>
                      <Badge variant="outline">{produto.categoria}</Badge>
                      {getTendenciaIcon(produto.tendencia)}
                      <Badge className={`${produto.risco_ruptura === 'alto' ? 'bg-red-100 text-red-800' : 
                        produto.risco_ruptura === 'médio' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                        Risco: {produto.risco_ruptura}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Estoque Atual:</span> {produto.estoque_atual}
                      </div>
                      <div>
                        <span className="font-medium">Vendas Mês:</span> {produto.vendas_mes_atual}
                      </div>
                      <div>
                        <span className="font-medium">Previsão 7d:</span> {produto.previsao_proximos_7_dias}
                      </div>
                      <div>
                        <span className="font-medium">Confiança:</span> {produto.confianca_previsao}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${produto.recomendacao === 'aumentar_estoque' ? 'bg-blue-100 text-blue-800' : 
                      produto.recomendacao === 'reduzir_estoque' ? 'bg-orange-100 text-orange-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                      {produto.recomendacao.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderSazonalidade = () => {
    if (!sazonalidadeData) return null;

    return (
      <div className="space-y-6">
        {/* Gráfico de Sazonalidade */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Padrão de Sazonalidade Anual</h3>
          <AreaChartComponent
            data={sazonalidadeData.dados_sazonalidade}
            xKey="mes"
            yKey="vendas"
            title="Vendas por Mês"
            height={300}
          />
        </Card>

        {/* Insights de Sazonalidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Meses de Pico
            </h3>
            <div className="space-y-2">
              {sazonalidadeData.insights.meses_pico.map((mes, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 mr-2">
                  {mes}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Meses de Baixa
            </h3>
            <div className="space-y-2">
              {sazonalidadeData.insights.meses_baixa.map((mes, index) => (
                <Badge key={index} className="bg-red-100 text-red-800 mr-2">
                  {mes}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Recomendações Sazonais */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Recomendações Estratégicas
          </h3>
          <div className="space-y-3">
            {sazonalidadeData.insights.recomendacoes.map((recomendacao, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <span className="text-blue-800">{recomendacao}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderRecomendacoes = () => {
    if (!recomendacoesData) return null;

    return (
      <div className="space-y-6">
        {/* Métricas da IA */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard
            title="Acurácia"
            value={`${recomendacoesData.metricas_ia.acuracia_previsoes}%`}
            icon={Target}
            color="blue"
          />
          <MetricCard
            title="Implementadas"
            value={recomendacoesData.metricas_ia.recomendacoes_implementadas}
            icon={CheckCircle}
            color="green"
          />
          <MetricCard
            title="Economia Gerada"
            value={`R$ ${recomendacoesData.metricas_ia.economia_gerada.toLocaleString()}`}
            icon={TrendingUp}
            color="purple"
          />
          <MetricCard
            title="Tempo Economizado"
            value={recomendacoesData.metricas_ia.tempo_economia}
            icon={Clock}
            color="orange"
          />
          <MetricCard
            title="Satisfação"
            value={`${recomendacoesData.metricas_ia.satisfacao_usuario}/5`}
            icon={Zap}
            color="yellow"
          />
        </div>

        {/* Lista de Recomendações */}
        <div className="space-y-4">
          {recomendacoesData.recomendacoes.map((recomendacao) => (
            <Card key={recomendacao.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold">{recomendacao.titulo}</h3>
                  <Badge className={getPrioridadeColor(recomendacao.prioridade)}>
                    {recomendacao.prioridade}
                  </Badge>
                </div>
                <Badge variant="outline">{recomendacao.tipo}</Badge>
              </div>
              
              <p className="text-gray-600 mb-4">{recomendacao.descricao}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Ação Recomendada</span>
                  <p className="text-blue-700">{recomendacao.acao_recomendada}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-green-800">Impacto Estimado</span>
                  <p className="text-green-700">{recomendacao.impacto_estimado}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-purple-800">Prazo</span>
                  <p className="text-purple-700">{recomendacao.prazo}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Confiança:</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${recomendacao.confianca}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{recomendacao.confianca}%</span>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Implementar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderTendencias = () => {
    if (!tendenciasData) return null;

    return (
      <div className="space-y-6">
        {/* Análise por Categoria */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tendenciasData.tendencias.map((tendencia, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{tendencia.categoria}</h3>
                {getTendenciaIcon(tendencia.tendencia)}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Crescimento:</span>
                  <span className={`font-medium ${tendencia.percentual_crescimento > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tendencia.percentual_crescimento > 0 ? '+' : ''}{tendencia.percentual_crescimento}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Previsão 3m:</span>
                  <span className="font-medium">{tendencia.previsao_3_meses}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Confiança:</span>
                  <span className="font-medium">{tendencia.confianca}%</span>
                </div>
                
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700">Fatores:</span>
                  <ul className="mt-2 space-y-1">
                    {tendencia.fatores.map((fator, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        {fator}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Insights do Mercado */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Insights do Mercado
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">Oportunidades</h4>
              <div className="space-y-2">
                {tendenciasData.insights_mercado.oportunidades.map((oportunidade, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-green-800">{oportunidade}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-red-800 mb-3">Riscos</h4>
              <div className="space-y-2">
                {tendenciasData.insights_mercado.riscos.map((risco, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                    <span className="text-sm text-red-800">{risco}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const tabs = [
    { id: 'previsao', label: 'Previsão de Demanda', icon: BarChart3 },
    { id: 'sazonalidade', label: 'Sazonalidade', icon: Calendar },
    { id: 'recomendacoes', label: 'Recomendações IA', icon: Lightbulb },
    { id: 'tendencias', label: 'Tendências', icon: TrendingUp }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              IA Preditiva
            </h1>
            <p className="text-gray-600 mt-1">Análises inteligentes e previsões baseadas em IA</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={filtros.periodo} 
            onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          
          <Button onClick={loadData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <div>
          {activeTab === 'previsao' && renderPrevisaoDemanda()}
          {activeTab === 'sazonalidade' && renderSazonalidade()}
          {activeTab === 'recomendacoes' && renderRecomendacoes()}
          {activeTab === 'tendencias' && renderTendencias()}
        </div>
      )}
    </div>
  );
};

export default IAPreditiva;