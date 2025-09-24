#!/bin/bash

echo "🔧 Configurando PostgreSQL..."

# Configurar senha do usuário
sudo -u postgres psql -c "ALTER USER validade_user PASSWORD 'validade_password';"

# Criar banco de dados se não existir
sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = 'validade_inteligente';" | grep -q 1 || sudo -u postgres createdb validade_inteligente

# Dar permissões ao usuário
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE validade_inteligente TO validade_user;"

echo "✅ PostgreSQL configurado!"