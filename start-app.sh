#!/bin/bash

echo "🚀 Iniciando Validade Inteligente no WSL2..."

# Verificar se os serviços estão rodando
echo "🔍 Verificando serviços..."

# Verificar PostgreSQL
if ! sudo systemctl is-active --quiet postgresql; then
    echo "🐘 Iniciando PostgreSQL..."
    sudo systemctl start postgresql
fi

# Verificar Redis
if ! sudo systemctl is-active --quiet redis-server; then
    echo "🔴 Iniciando Redis..."
    sudo systemctl start redis-server
fi

echo "✅ Serviços verificados!"

# Tornar scripts executáveis
chmod +x run-backend.sh
chmod +x run-frontend.sh

echo ""
echo "🎯 Para iniciar a aplicação, execute em terminais separados:"
echo ""
echo "Terminal 1 (Backend):"
echo "  ./run-backend.sh"
echo ""
echo "Terminal 2 (Frontend):"
echo "  ./run-frontend.sh"
echo ""
echo "🌐 Acesse a aplicação em: http://localhost:3000"
echo "🔧 API disponível em: http://localhost:5000"