import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Star, Shield, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const TesteGratuito = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    nomeEstabelecimento: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    tipoEstabelecimento: '',
    numeroFuncionarios: '',
    aceitaTermos: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.aceitaTermos) {
      alert('Por favor, aceite os termos de uso para continuar.');
      return;
    }
    // Aqui você implementaria o envio do formulário
    alert('Cadastro realizado com sucesso! Você receberá as instruções de acesso por e-mail.');
  };

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Teste Gratuito por 30 Dias
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experimente todas as funcionalidades do Validade Inteligente sem compromisso. 
            Comece a reduzir suas perdas hoje mesmo!
          </p>
          
          {/* Benefits */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">30 Dias Grátis</h3>
              <p className="text-sm text-gray-600">Acesso completo sem custo</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Sem Compromisso</h3>
              <p className="text-sm text-gray-600">Cancele quando quiser</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Suporte Completo</h3>
              <p className="text-sm text-gray-600">Treinamento e suporte inclusos</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Todas as Funcionalidades</h3>
              <p className="text-sm text-gray-600">Acesso completo ao sistema</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Cadastre-se para o Teste Gratuito
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="nomeCompleto"
                        name="nomeCompleto"
                        required
                        value={formData.nomeCompleto}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      required
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                {/* Business Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Estabelecimento</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nomeEstabelecimento" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Estabelecimento *
                      </label>
                      <input
                        type="text"
                        id="nomeEstabelecimento"
                        name="nomeEstabelecimento"
                        required
                        value={formData.nomeEstabelecimento}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nome da sua empresa"
                      />
                    </div>
                    <div>
                      <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
                        CNPJ *
                      </label>
                      <input
                        type="text"
                        id="cnpj"
                        name="cnpj"
                        required
                        value={formData.cnpj}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label htmlFor="tipoEstabelecimento" className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Estabelecimento *
                      </label>
                      <select
                        id="tipoEstabelecimento"
                        name="tipoEstabelecimento"
                        required
                        value={formData.tipoEstabelecimento}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione...</option>
                        <option value="supermercado">Supermercado</option>
                        <option value="padaria">Padaria</option>
                        <option value="restaurante">Restaurante</option>
                        <option value="farmacia">Farmácia</option>
                        <option value="lanchonete">Lanchonete</option>
                        <option value="mercearia">Mercearia</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="numeroFuncionarios" className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Funcionários
                      </label>
                      <select
                        id="numeroFuncionarios"
                        name="numeroFuncionarios"
                        value={formData.numeroFuncionarios}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione...</option>
                        <option value="1-5">1 a 5</option>
                        <option value="6-10">6 a 10</option>
                        <option value="11-25">11 a 25</option>
                        <option value="26-50">26 a 50</option>
                        <option value="50+">Mais de 50</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço Completo *
                      </label>
                      <input
                        type="text"
                        id="endereco"
                        name="endereco"
                        required
                        value={formData.endereco}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Rua, número, bairro"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          id="cidade"
                          name="cidade"
                          required
                          value={formData.cidade}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Cidade"
                        />
                      </div>
                      <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                          Estado *
                        </label>
                        <select
                          id="estado"
                          name="estado"
                          required
                          value={formData.estado}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione...</option>
                          <option value="SP">São Paulo</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="PR">Paraná</option>
                          <option value="SC">Santa Catarina</option>
                          {/* Adicione outros estados conforme necessário */}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                          CEP *
                        </label>
                        <input
                          type="text"
                          id="cep"
                          name="cep"
                          required
                          value={formData.cep}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="aceitaTermos"
                    name="aceitaTermos"
                    checked={formData.aceitaTermos}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="aceitaTermos" className="ml-3 text-sm text-gray-600">
                    Aceito os <a href="#" className="text-blue-600 hover:text-blue-700">termos de uso</a> e 
                    a <a href="#" className="text-blue-600 hover:text-blue-700">política de privacidade</a> *
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Iniciar Teste Gratuito
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* What's Included */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                O que está incluído:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Controle completo de validade</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Alertas automáticos</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Relatórios detalhados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Dashboard inteligente</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Suporte técnico</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Treinamento completo</span>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Em apenas 2 semanas conseguimos reduzir nossas perdas em 70%. 
                O sistema é muito fácil de usar!"
              </p>
              <div className="text-sm text-gray-600">
                <strong>Maria Silva</strong><br />
                Supermercado Silva & Cia
              </div>
            </div>

            {/* Support */}
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Suporte 24/7</h3>
              <p className="text-sm text-gray-600 mb-4">
                Nossa equipe está sempre disponível para ajudar você
              </p>
              <Link 
                to="/contato"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Falar com Suporte
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TesteGratuito;