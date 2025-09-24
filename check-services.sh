#!/bin/bash

echo "🔍 Verificando serviços do Validade Inteligente..."

# Verificar PostgreSQL
echo "🐘 PostgreSQL:"
if sudo systemctl is-active --quiet postgresql; then
    echo "  ✅ Ativo"
    sudo -u postgres psql -c "SELECT version();" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "  ✅ Conectando corretamente"
    else
        echo "  ❌ Erro de conexão"
    fi
else
    echo "  ❌ Inativo"
fi

# Verificar Redis
echo "🔴 Redis:"
if sudo systemctl is-active --quiet redis-server; then
    echo "  ✅ Ativo"
    redis-cli ping > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "  ✅ Respondendo"
    else
        echo "  ❌ Não responde"
    fi
else
    echo "  ❌ Inativo"
fi

# Verificar Python
echo "🐍 Python:"
if command -v python3 &> /dev/null; then
    echo "  ✅ Instalado: $(python3 --version)"
else
    echo "  ❌ Não instalado"
fi

# Verificar Node.js
echo "📦 Node.js:"
if command -v node &> /dev/null; then
    echo "  ✅ Instalado: $(node --version)"
else
    echo "  ❌ Não instalado"
fi

# Verificar pnpm
echo "📦 pnpm:"
if command -v pnpm &> /dev/null; then
    echo "  ✅ Instalado: $(pnpm --version)"
else
    echo "  ❌ Não instalado"
fi

# Verificar portas
echo "🌐 Portas:"
if lsof -i :5000 > /dev/null 2>&1; then
    echo "  ⚠️  Porta 5000 em uso"
else
    echo "  ✅ Porta 5000 livre"
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "  ⚠️  Porta 3000 em uso"
else
    echo "  ✅ Porta 3000 livre"
fi

echo ""
echo "🎯 Status geral:"
if sudo systemctl is-active --quiet postgresql && sudo systemctl is-active --quiet redis-server; then
    echo "✅ Sistema pronto para executar a aplicação!"
else
    echo "❌ Alguns serviços precisam ser iniciados"
    echo "Execute: ./start-app.sh"
fi