import React from 'react';
import { ArrowLeft, Users, Target, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sobre = () => {
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
            Sobre o Validade Inteligente
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos uma empresa dedicada a revolucionar o controle de estoque e reduzir o desperdício 
            de alimentos através de tecnologia inteligente e inovadora.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nossa Missão</h3>
            <p className="text-gray-600">
              Reduzir o desperdício de alimentos e otimizar o controle de estoque através de 
              soluções tecnológicas inteligentes e acessíveis.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nossos Valores</h3>
            <p className="text-gray-600">
              Sustentabilidade, inovação, transparência e compromisso com o sucesso 
              dos nossos clientes e do meio ambiente.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nossa Visão</h3>
            <p className="text-gray-600">
              Ser a principal plataforma de controle de validade no Brasil, 
              contribuindo para um futuro mais sustentável.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Nossa História
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              O Validade Inteligente nasceu da necessidade real observada em pequenos e médios 
              estabelecimentos comerciais: o controle manual de validade de produtos, que resultava 
              em perdas significativas e impacto ambiental negativo.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Em 2023, nossa equipe de desenvolvedores e especialistas em gestão comercial se uniu 
              para criar uma solução que fosse ao mesmo tempo poderosa e fácil de usar, permitindo 
              que qualquer estabelecimento pudesse ter controle total sobre seu estoque.
            </p>
            <p className="text-lg text-gray-600">
              Hoje, já ajudamos centenas de estabelecimentos a reduzir suas perdas em até 85%, 
              gerando economia significativa e contribuindo para um mundo mais sustentável.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nossa Equipe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Equipe de Desenvolvimento</h3>
              <p className="text-gray-600">
                Especialistas em tecnologia dedicados a criar soluções inovadoras e eficientes.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultores Comerciais</h3>
              <p className="text-gray-600">
                Profissionais experientes em gestão comercial e controle de estoque.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Suporte ao Cliente</h3>
              <p className="text-gray-600">
                Equipe dedicada a garantir o sucesso e satisfação de nossos clientes.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-blue-600 rounded-lg shadow-lg p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Nossos Números</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Clientes Ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-blue-100">Redução de Desperdício</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">R$ 2M+</div>
              <div className="text-blue-100">Economia Gerada</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Suporte Disponível</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Quer fazer parte dessa transformação?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a centenas de estabelecimentos que já reduziram suas perdas
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
              Entre em Contato
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sobre;