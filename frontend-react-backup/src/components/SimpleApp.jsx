import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, CheckCircle, TrendingUp, Shield, Smartphone, BarChart3, Target, Users, Zap, Award, ArrowRight, Star } from 'lucide-react';

function SimpleApp() {
  const [activeTab, setActiveTab] = useState('funcionalidades');
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Validade Inteligente</h1>
                <p className="text-sm text-gray-600">Gestão Inteligente de Validade</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#funcionalidades" className="text-gray-700 hover:text-green-600 transition-colors">Funcionalidades</a>
              <a href="#planos" className="text-gray-700 hover:text-green-600 transition-colors">Planos</a>
              <Link to="/sobre" className="text-gray-700 hover:text-green-600 transition-colors">Sobre</Link>
              <Link to="/contato" className="text-gray-700 hover:text-green-600 transition-colors">Contato</Link>
            </nav>
            <button 
              onClick={handleLogin}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            🚀 Reduza perdas em até 70%
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Reduza perdas, maximize lucros e
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> combata o desperdício</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A gestão de validade do futuro para pequenos e médios varejistas. 
            Inteligência artificial que não apenas alerta, mas age proativamente para evitar perdas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/teste-gratuito"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Teste Grátis por 30 Dias
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/demo"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
            >
              Ver Demonstração
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/teste-gratuito"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Começar Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button 
              onClick={handleLogin}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Fazer Login
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">70%</div>
              <div className="text-gray-600">Redução de perdas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15min</div>
              <div className="text-gray-600">Setup completo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Monitoramento</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades que fazem a diferença
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologia de ponta para transformar a gestão de validade do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Controle Automático</h3>
              <p className="text-gray-600">
                Monitoramento automático de validades com alertas inteligentes e ações preventivas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IA Preditiva</h3>
              <p className="text-gray-600">
                Inteligência artificial que prevê padrões de consumo e otimiza seu estoque.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">App Mobile</h3>
              <p className="text-gray-600">
                Acesse tudo pelo celular com scanner de código de barras integrado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Reduzir Suas Perdas?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de varejistas que já economizaram milhões com o Validade Inteligente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/teste-gratuito"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Começar Teste Gratuito
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/contato"
              className="border border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
            >
              Falar com Especialista
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Validade Inteligente</span>
          </div>
          <p className="text-gray-400 mb-8">
            Transformando a gestão de validade com inteligência artificial
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
            <Link to="/contato" className="hover:text-white transition-colors">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SimpleApp;