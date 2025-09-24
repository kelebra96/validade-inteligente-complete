#!/bin/bash

echo "🚀 Iniciando frontend Validade Inteligente..."

# Configurar pnpm no PATH
export PATH="$HOME/.local/share/pnpm:$PATH"

# Navegar para o diretório do frontend
cd frontend

# Carregar variáveis de ambiente
set -a
source ../.env.wsl2 | grep -v '^#' | grep -v '^$'
set +a

# Instalar dependências se node_modules não existir
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    pnpm install
fi

# Criar arquivo .env local para o Vite
echo "VITE_API_URL=$VITE_API_URL" > .env.local

# Iniciar servidor de desenvolvimento
echo "🌟 Iniciando servidor frontend na porta $FRONTEND_PORT..."
pnpm dev --host 0.0.0.0 --port $FRONTEND_PORT