import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Bell, 
  Settings, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  DollarSign,
  Package,
  Filter,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import ApiService from '@/services/api';
import { toast } from 'sonner';

const AlertasInteligentes = () => {
  const [alertas, setAlertas] = useState([]);
  const [configuracoes, setConfiguracoes] = useState({});
  const [estatisticas, setEstatisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    tipo: '',
    prioridade: '',
    categoria: ''
  });

  useEffect(() => {
    loadData();
  }, [filtros]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [alertasData, configData, statsData] = await Promise.all([
        ApiService.getAlertasAtivos(filtros),
        ApiService.getConfiguracaoAlertas(),
        ApiService.getEstatisticasAlertas()
      ]);

      setAlertas(alertasData.alertas || []);
      setConfiguracoes(configData.configuracoes || {});
      setEstatisticas(statsData.estatisticas || {});
    } catch (error) {
      console.error('Erro ao carregar dados dos alertas:', error);
      toast.error('Erro ao carregar dados dos alertas');
    } finally {
      setLoading(false);
    }
  };

  const handleResolverAlerta = async (alertaId, acao) => {
    try {
      await ApiService.resolverAlerta(alertaId, { acao, observacoes: `Ação: ${acao}` });
      toast.success('Alerta resolvido com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro ao resolver alerta:', error);
      toast.error('Erro ao resolver alerta');
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'critico': return 'bg-red-500';
      case 'alto': return 'bg-orange-500';
      case 'moderado': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando alertas...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8 text-orange-600" />
            Alertas Inteligentes
          </h1>
          <p className="text-gray-600 mt-2">
            Sistema de alertas baseado em IA para prevenção de perdas
          </p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Alertas</p>
                <p className="text-2xl font-bold">{alertas.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Críticos</p>
                <p className="text-2xl font-bold text-red-600">
                  {alertas.filter(a => a.tipo === 'critico').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Economia Estimada</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {estatisticas.economia_estimada?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Resolução</p>
                <p className="text-2xl font-bold text-blue-600">
                  {estatisticas.taxa_resolucao?.toFixed(1) || '0'}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alertas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alertas">Alertas Ativos</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="alertas" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={filtros.tipo} onValueChange={(value) => setFiltros({...filtros, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Alerta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os Tipos</SelectItem>
                    <SelectItem value="critico">Crítico</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="moderado">Moderado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtros.prioridade} onValueChange={(value) => setFiltros({...filtros, prioridade: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as Prioridades</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtros.categoria} onValueChange={(value) => setFiltros({...filtros, categoria: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as Categorias</SelectItem>
                    <SelectItem value="Laticínios">Laticínios</SelectItem>
                    <SelectItem value="Padaria">Padaria</SelectItem>
                    <SelectItem value="Carnes">Carnes</SelectItem>
                    <SelectItem value="Frutas">Frutas</SelectItem>
                    <SelectItem value="Verduras">Verduras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Alertas */}
          <div className="space-y-4">
            {alertas.map((alerta) => (
              <Card key={alerta.id} className="border-l-4" style={{borderLeftColor: getTipoColor(alerta.tipo)}}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{alerta.produto_nome}</h3>
                        <Badge className={getPrioridadeColor(alerta.prioridade)}>
                          {alerta.prioridade.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{alerta.categoria}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Risco</p>
                          <p className="font-semibold">{alerta.risco_percentual}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Quantidade</p>
                          <p className="font-semibold">{alerta.quantidade} unidades</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Dias para Vencer</p>
                          <p className="font-semibold">{alerta.dias_vencimento} dias</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Perda Estimada</p>
                          <p className="font-semibold text-red-600">
                            R$ {alerta.valor_estimado_perda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-gray-600 text-sm">Ação Recomendada:</p>
                        <p className="font-medium">{alerta.acao_recomendada}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        size="sm" 
                        onClick={() => handleResolverAlerta(alerta.id, 'desconto_aplicado')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleResolverAlerta(alerta.id, 'monitorar')}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Monitorar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {alertas.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum alerta ativo</h3>
                <p className="text-gray-600">Todos os produtos estão dentro dos parâmetros normais.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por Tipo */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Crítico', value: estatisticas.distribuicao_tipos?.critico || 0 },
                        { name: 'Alto', value: estatisticas.distribuicao_tipos?.alto || 0 },
                        { name: 'Moderado', value: estatisticas.distribuicao_tipos?.moderado || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {[
                        { name: 'Crítico', value: estatisticas.distribuicao_tipos?.critico || 0 },
                        { name: 'Alto', value: estatisticas.distribuicao_tipos?.alto || 0 },
                        { name: 'Moderado', value: estatisticas.distribuicao_tipos?.moderado || 0 }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Categorias com Mais Alertas */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias com Mais Alertas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estatisticas.categorias_mais_alertas || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tendência Semanal */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendência Semanal de Alertas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={estatisticas.tendencia_semanal || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="alertas" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  As configurações de alertas permitem personalizar quando e como você recebe notificações sobre produtos próximos ao vencimento.
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Limites de Risco</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Crítico (%)</label>
                      <Input 
                        type="number" 
                        value={configuracoes.limites_risco?.critico || 70}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Alto (%)</label>
                      <Input 
                        type="number" 
                        value={configuracoes.limites_risco?.alto || 50}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Moderado (%)</label>
                      <Input 
                        type="number" 
                        value={configuracoes.limites_risco?.moderado || 30}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Notificações</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Email</span>
                      <Badge variant={configuracoes.notificacoes?.email_ativo ? "default" : "secondary"}>
                        {configuracoes.notificacoes?.email_ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Push</span>
                      <Badge variant={configuracoes.notificacoes?.push_ativo ? "default" : "secondary"}>
                        {configuracoes.notificacoes?.push_ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS</span>
                      <Badge variant={configuracoes.notificacoes?.sms_ativo ? "default" : "secondary"}>
                        {configuracoes.notificacoes?.sms_ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Ações Automáticas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Desconto Automático</span>
                      <Badge variant={configuracoes.acoes_automaticas?.desconto_automatico ? "default" : "secondary"}>
                        {configuracoes.acoes_automaticas?.desconto_automatico ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Promoção Automática</span>
                      <Badge variant={configuracoes.acoes_automaticas?.promocao_automatica ? "default" : "secondary"}>
                        {configuracoes.acoes_automaticas?.promocao_automatica ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Alerta ao Fornecedor</span>
                      <Badge variant={configuracoes.acoes_automaticas?.alerta_fornecedor ? "default" : "secondary"}>
                        {configuracoes.acoes_automaticas?.alerta_fornecedor ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertasInteligentes;