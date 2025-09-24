#!/bin/bash

echo "🚀 Iniciando backend Validade Inteligente..."

# Navegar para o diretório do backend
cd validade-inteligente-backend

# Carregar variáveis de ambiente
export $(cat ../.env.wsl2 | xargs)

# Criar ambiente virtual se não existir
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual Python..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
echo "🔧 Ativando ambiente virtual..."
source venv/bin/activate

# Instalar dependências
echo "📦 Instalando dependências..."
pip install -r requirements.txt

# Executar migrações (se necessário)
echo "🗄️ Executando migrações..."
cd src
python -c "
import sys
sys.path.append('.')
from models.database import init_db
init_db()
print('✅ Banco de dados inicializado!')
"

# Iniciar servidor
echo "🌟 Iniciando servidor backend na porta $BACKEND_PORT..."
python -m gunicorn --bind 0.0.0.0:$BACKEND_PORT --reload app:app