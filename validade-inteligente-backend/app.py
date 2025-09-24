#!/usr/bin/env python3
import os
import sys

# Adicionar o diretório src ao Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Importar a aplicação
from models.main import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)