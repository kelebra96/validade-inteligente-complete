import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Trophy, 
  Star, 
  Target, 
  Award, 
  Users, 
  TrendingUp,
  Calendar,
  Zap,
  Crown,
  Medal,
  Gift,
  Clock,
  CheckCircle,
  ArrowUp
} from 'lucide-react';
import apiService from '../services/api';

const Gamificacao = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(true);
  const [perfilData, setPerfilData] = useState(null);
  const [rankingData, setRankingData] = useState([]);
  const [badgesData, setBadgesData] = useState([]);
  const [desafiosData, setDesafiosData] = useState([]);
  const [estatisticasGerais, setEstatisticasGerais] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [perfil, ranking, badges, desafios, stats] = await Promise.all([
        apiService.getPerfilUsuario(1), // Assumindo usuário ID 1
        apiService.getRanking(),
        apiService.getBadges(),
        apiService.getDesafios(),
        apiService.getEstatisticasGerais()
      ]);

      setPerfilData(perfil.data);
      setRankingData(ranking.data);
      setBadgesData(badges.data);
      setDesafiosData(desafios.data);
      setEstatisticasGerais(stats.data);
    } catch (error) {
      console.error('Erro ao carregar dados da gamificação:', error);
    } finally {
      setLoading(false);
    }
  };

  const completarDesafio = async (desafioId) => {
    try {
      await apiService.completarDesafio(desafioId);
      await loadData(); // Recarrega os dados
    } catch (error) {
      console.error('Erro ao completar desafio:', error);
    }
  };

  const getNivelColor = (nivel) => {
    const colors = {
      'Novato': 'bg-gray-100 text-gray-800',
      'Iniciante': 'bg-green-100 text-green-800',
      'Intermediário': 'bg-blue-100 text-blue-800',
      'Avançado': 'bg-purple-100 text-purple-800',
      'Expert': 'bg-yellow-100 text-yellow-800',
      'Lenda': 'bg-red-100 text-red-800'
    };
    return colors[nivel] || 'bg-gray-100 text-gray-800';
  };

  const getPrioridadeColor = (tipo) => {
    const colors = {
      'diario': 'border-l-green-500',
      'semanal': 'border-l-blue-500',
      'mensal': 'border-l-purple-500'
    };
    return colors[tipo] || 'border-l-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎮 Sistema de Gamificação</h1>
          <p className="text-gray-600">Acompanhe seu progresso, conquiste badges e suba no ranking!</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'perfil', label: 'Meu Perfil', icon: Users },
            { id: 'ranking', label: 'Ranking', icon: Trophy },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'desafios', label: 'Desafios', icon: Target }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Perfil Tab */}
        {activeTab === 'perfil' && perfilData && (
          <div className="space-y-6">
            {/* Perfil Header */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{perfilData.avatar}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{perfilData.nome}</h2>
                    <Badge className={`${getNivelColor(perfilData.nivel)} mt-1`}>
                      {perfilData.nivel}
                    </Badge>
                    <p className="text-gray-600 mt-1">#{perfilData.estatisticas.posicao_ranking} no ranking</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{perfilData.pontos.toLocaleString()}</div>
                  <p className="text-gray-600">pontos totais</p>
                </div>
              </div>
            </Card>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{perfilData.estatisticas.pontos_hoje}</p>
                    <p className="text-gray-600 text-sm">Pontos hoje</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center">
                  <Zap className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{perfilData.estatisticas.streak_dias}</p>
                    <p className="text-gray-600 text-sm">Dias consecutivos</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{perfilData.estatisticas.badges_conquistadas}</p>
                    <p className="text-gray-600 text-sm">Badges conquistadas</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{perfilData.estatisticas.desafios_completados}</p>
                    <p className="text-gray-600 text-sm">Desafios completados</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Progresso para Próximo Nível */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso para o Próximo Nível</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{perfilData.nivel}</span>
                  <span>{perfilData.estatisticas.proximo_nivel}</span>
                </div>
                <Progress 
                  value={(perfilData.pontos / perfilData.estatisticas.pontos_proximo_nivel) * 100} 
                  className="h-3"
                />
                <p className="text-sm text-gray-600">
                  {perfilData.estatisticas.pontos_proximo_nivel - perfilData.pontos} pontos para o próximo nível
                </p>
              </div>
            </Card>

            {/* Badges Conquistadas */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges Conquistadas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {perfilData.badges_detalhadas.map((badge, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-2">{badge.emoji}</div>
                    <h4 className="font-semibold text-gray-900">{badge.nome}</h4>
                    <p className="text-sm text-gray-600">{badge.descricao}</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      +{badge.pontos} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Ranking Tab */}
        {activeTab === 'ranking' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">🏆 Ranking Geral</h3>
            <div className="space-y-4">
              {rankingData.map((usuario, index) => (
                <div 
                  key={usuario.id} 
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                      {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                      {index === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                      {index === 2 && <Medal className="w-5 h-5 text-orange-500" />}
                      {index > 2 && usuario.posicao}
                    </div>
                    <div className="text-3xl">{usuario.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{usuario.nome}</h4>
                      <Badge className={`${getNivelColor(usuario.nivel)} text-xs`}>
                        {usuario.nivel}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{usuario.pontos.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">pontos</p>
                    <div className="flex space-x-1 mt-1">
                      {usuario.badges.map((badge, badgeIndex) => (
                        <span key={badgeIndex} className="text-lg">{badge}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgesData.map((badge, index) => (
              <Card key={index} className="p-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">{badge.emoji}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{badge.nome}</h3>
                  <p className="text-gray-600 mb-4">{badge.descricao}</p>
                  <Badge className="bg-blue-100 text-blue-800">
                    +{badge.pontos} pontos
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Desafios Tab */}
        {activeTab === 'desafios' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {desafiosData.map((desafio) => (
                <Card key={desafio.id} className={`p-6 border-l-4 ${getPrioridadeColor(desafio.tipo)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{desafio.icone}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{desafio.titulo}</h3>
                        <p className="text-gray-600">{desafio.descricao}</p>
                      </div>
                    </div>
                    <Badge className={`${
                      desafio.tipo === 'diario' ? 'bg-green-100 text-green-800' :
                      desafio.tipo === 'semanal' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {desafio.tipo}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progresso: {desafio.progresso}/{desafio.meta}</span>
                      <span className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {desafio.expira_em}
                      </span>
                    </div>
                    
                    <Progress 
                      value={(desafio.progresso / desafio.meta) * 100} 
                      className="h-2"
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-600">
                        <Gift className="w-4 h-4 mr-1" />
                        <span className="font-semibold">+{desafio.pontos} pontos</span>
                      </div>
                      
                      {desafio.progresso >= desafio.meta ? (
                        <Button 
                          onClick={() => completarDesafio(desafio.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resgatar
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          <ArrowUp className="w-4 h-4 mr-2" />
                          Em progresso
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gamificacao;