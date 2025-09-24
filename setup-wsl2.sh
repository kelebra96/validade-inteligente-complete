#!/bin/bash

echo "🚀 Configurando ambiente WSL2 para Validade Inteligente..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar PostgreSQL
echo "🐘 Instalando PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Configurar PostgreSQL
echo "⚙️ Configurando PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar usuário e banco de dados
sudo -u postgres psql -c "CREATE USER validade_user WITH PASSWORD 'validade_password';"
sudo -u postgres psql -c "CREATE DATABASE validade_inteligente OWNER validade_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE validade_inteligente TO validade_user;"

# Instalar Redis
echo "🔴 Instalando Redis..."
sudo apt install -y redis-server

# Configurar Redis
echo "⚙️ Configurando Redis..."
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Instalar Python e pip
echo "🐍 Instalando Python..."
sudo apt install -y python3 python3-pip python3-venv

# Instalar Node.js e npm
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar pnpm
echo "📦 Instalando pnpm..."
npm install -g pnpm

echo "✅ Configuração do WSL2 concluída!"
echo ""
echo "🔧 Próximos passos:"
echo "1. Configurar variáveis de ambiente"
echo "2. Instalar dependências do backend"
echo "3. Instalar dependências do frontend"
echo "4. Executar migrações do banco"
echo "5. Iniciar aplicações"