# 🚀 Instruções para Migração WSL2

## Passo 1: Abrir WSL2

Abra o terminal WSL2 (Ubuntu) e navegue até o diretório do projeto:

```bash
cd /mnt/c/Devs/validade-inteligente-complete
```

## Passo 2: Tornar Scripts Executáveis

```bash
chmod +x *.sh
```

## Passo 3: Configurar Ambiente

Execute o script de configuração:

```bash
./setup-wsl2.sh
```

Este script irá instalar:
- PostgreSQL
- Redis
- Python 3
- Node.js 18
- pnpm

## Passo 4: Verificar Serviços

```bash
./check-services.sh
```

## Passo 5: Iniciar Aplicação

### Opção A: Script Automático
```bash
./start-app.sh
```

### Opção B: Manual (2 terminais)

**Terminal 1 - Backend:**
```bash
./run-backend.sh
```

**Terminal 2 - Frontend:**
```bash
./run-frontend.sh
```

## 🎯 Resultado Esperado

- ✅ Sem erros de WebSocket
- ✅ Sem erros de plugin React
- ✅ Hot reload funcionando
- ✅ Melhor performance
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000

## 🔧 Resolução de Problemas

Se algum serviço não iniciar:

```bash
# Reiniciar PostgreSQL
sudo systemctl restart postgresql

# Reiniciar Redis
sudo systemctl restart redis-server

# Verificar logs
sudo journalctl -u postgresql
sudo journalctl -u redis-server
```

## 📝 Notas Importantes

1. **Todos os containers Docker foram parados**
2. **Configuração otimizada para WSL2**
3. **Variáveis de ambiente configuradas**
4. **Scripts prontos para execução**
5. **Documentação completa criada**

Execute os comandos no **WSL2 (Ubuntu)**, não no PowerShell do Windows!