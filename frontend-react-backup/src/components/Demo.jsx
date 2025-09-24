import React from 'react';
import { ArrowLeft, Play, CheckCircle, BarChart3, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-600">Validade Inteligente</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Demonstração do Sistema
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Veja como o Validade Inteligente pode transformar o controle de estoque do seu estabelecimento
          </p>
          
          {/* Video Demo Placeholder */}
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-4xl mx-auto mb-12">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <Play className="h-20 w-20 text-white mx-auto mb-4" />
                <p className="text-white text-lg">Vídeo Demonstrativo</p>
                <p className="text-gray-300">Clique para assistir (5 min)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Demo */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Inteligente</h3>
            <p className="text-gray-600 mb-6">
              Visualize todos os seus produtos próximos ao vencimento em tempo real
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-2">Produtos vencendo hoje:</div>
              <div className="text-2xl font-bold text-red-600">12</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Alertas Inteligentes</h3>
            <p className="text-gray-600 mb-6">
              Receba notificações automáticas antes dos produtos vencerem
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm text-yellow-700">⚠️ Alerta: 5 produtos vencem em 2 dias</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Relatórios Automáticos</h3>
            <p className="text-gray-600 mb-6">
              Gere relatórios detalhados sobre perdas e economia
            </p>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-700 mb-1">Economia este mês:</div>
              <div className="text-xl font-bold text-green-600">R$ 2.847,50</div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Benefícios Comprovados
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <span className="text-gray-700">Redução de 85% no desperdício</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <span className="text-gray-700">Economia média de R$ 3.500/mês</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <span className="text-gray-700">Controle 100% automatizado</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <span className="text-gray-700">Alertas em tempo real</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <span className="text-gray-700">Relatórios detalhados</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <span className="text-gray-700">Suporte técnico 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Inicie seu teste gratuito de 30 dias agora mesmo
          </p>
          <div className="space-x-4">
            <Link 
              to="/teste-gratuito"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Começar Teste Gratuito
            </Link>
            <Link 
              to="/contato"
              className="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors inline-block"
            >
              Falar com Especialista
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Demo;