# Validade Inteligente - Configuração WSL2

Este guia explica como executar a aplicação Validade Inteligente diretamente no WSL2, sem Docker.

## 🚀 Configuração Inicial

### 1. Configurar Ambiente WSL2

Execute o script de configuração:

```bash
chmod +x setup-wsl2.sh
./setup-wsl2.sh
```

Este script irá:
- Instalar PostgreSQL
- Instalar Redis
- Instalar Python 3 e pip
- Instalar Node.js 18 e pnpm
- Configurar os serviços

### 2. Configurar Variáveis de Ambiente

O arquivo `.env.wsl2` já está configurado com as variáveis necessárias. Ajuste se necessário:

```bash
cp .env.wsl2 .env
```

## 🏃‍♂️ Executando a Aplicação

### Opção 1: Script Automático

```bash
chmod +x start-app.sh
./start-app.sh
```

### Opção 2: Manual

**Terminal 1 - Backend:**
```bash
./run-backend.sh
```

**Terminal 2 - Frontend:**
```bash
./run-frontend.sh
```

## 🌐 Acessos

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🔧 Comandos Úteis

### Verificar Serviços
```bash
# PostgreSQL
sudo systemctl status postgresql

# Redis
sudo systemctl status redis-server
```

### Reiniciar Serviços
```bash
# PostgreSQL
sudo systemctl restart postgresql

# Redis
sudo systemctl restart redis-server
```

### Acessar Banco de Dados
```bash
sudo -u postgres psql validade_inteligente
```

## 🐛 Resolução de Problemas

### PostgreSQL não inicia
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Redis não inicia
```bash
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Erro de permissão nos scripts
```bash
chmod +x *.sh
```

### Porta já em uso
```bash
# Verificar processos usando as portas
sudo lsof -i :3000
sudo lsof -i :5000

# Matar processo se necessário
sudo kill -9 <PID>
```

## ✅ Vantagens da Configuração WSL2

- ✅ Sem problemas de WebSocket
- ✅ Hot reload funcionando perfeitamente
- ✅ Melhor performance
- ✅ Debugging mais fácil
- ✅ Sem problemas de plugin React
- ✅ Desenvolvimento mais ágil