from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random
import math

alertas_inteligentes_bp = Blueprint('alertas_inteligentes', __name__)

def calcular_risco_vencimento(produto):
    """Calcula o risco de vencimento baseado em múltiplos fatores"""
    dias_para_vencer = (produto.get('data_vencimento', datetime.now()) - datetime.now()).days
    
    # Fatores de risco
    risco_tempo = max(0, min(100, (7 - dias_para_vencer) * 20))  # Risco aumenta nos últimos 7 dias
    risco_estoque = min(100, produto.get('quantidade', 0) * 2)  # Mais estoque = mais risco
    risco_rotatividade = 100 - min(100, produto.get('vendas_mes', 1) * 10)  # Baixa rotatividade = alto risco
    
    # Peso dos fatores
    risco_total = (risco_tempo * 0.5 + risco_estoque * 0.3 + risco_rotatividade * 0.2)
    
    return min(100, max(0, risco_total))

def gerar_alertas_inteligentes():
    """Gera alertas inteligentes baseados em IA"""
    alertas = []
    
    # Simulação de produtos com risco
    produtos_risco = [
        {
            "id": 1,
            "nome": "Leite Integral 1L",
            "categoria": "Laticínios",
            "quantidade": 45,
            "data_vencimento": datetime.now() + timedelta(days=2),
            "vendas_mes": 120,
            "preco": 4.50
        },
        {
            "id": 2,
            "nome": "Pão de Forma",
            "categoria": "Padaria",
            "quantidade": 12,
            "data_vencimento": datetime.now() + timedelta(days=1),
            "vendas_mes": 80,
            "preco": 3.20
        },
        {
            "id": 3,
            "nome": "Iogurte Natural",
            "categoria": "Laticínios",
            "quantidade": 30,
            "data_vencimento": datetime.now() + timedelta(days=3),
            "vendas_mes": 60,
            "preco": 2.80
        }
    ]
    
    for produto in produtos_risco:
        risco = calcular_risco_vencimento(produto)
        
        if risco > 70:
            tipo = "critico"
            prioridade = "alta"
            acao = "Desconto de 50% ou doação imediata"
        elif risco > 50:
            tipo = "alto"
            prioridade = "media"
            acao = "Desconto de 30% ou promoção"
        elif risco > 30:
            tipo = "moderado"
            prioridade = "baixa"
            acao = "Monitorar e considerar promoção"
        else:
            continue
        
        alertas.append({
            "id": len(alertas) + 1,
            "produto_id": produto["id"],
            "produto_nome": produto["nome"],
            "categoria": produto["categoria"],
            "tipo": tipo,
            "prioridade": prioridade,
            "risco_percentual": round(risco, 1),
            "quantidade": produto["quantidade"],
            "dias_vencimento": (produto["data_vencimento"] - datetime.now()).days,
            "valor_estimado_perda": round(produto["quantidade"] * produto["preco"], 2),
            "acao_recomendada": acao,
            "data_criacao": datetime.now().isoformat(),
            "status": "ativo"
        })
    
    return alertas

@alertas_inteligentes_bp.route('/alertas-ativos', methods=['GET'])
def alertas_ativos():
    """Endpoint para obter alertas ativos"""
    try:
        alertas = gerar_alertas_inteligentes()
        
        # Filtros opcionais
        tipo = request.args.get('tipo')
        prioridade = request.args.get('prioridade')
        categoria = request.args.get('categoria')
        
        if tipo:
            alertas = [a for a in alertas if a['tipo'] == tipo]
        if prioridade:
            alertas = [a for a in alertas if a['prioridade'] == prioridade]
        if categoria:
            alertas = [a for a in alertas if a['categoria'].lower() == categoria.lower()]
        
        return jsonify({
            "success": True,
            "alertas": alertas,
            "total": len(alertas),
            "resumo": {
                "criticos": len([a for a in alertas if a['tipo'] == 'critico']),
                "altos": len([a for a in alertas if a['tipo'] == 'alto']),
                "moderados": len([a for a in alertas if a['tipo'] == 'moderado'])
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@alertas_inteligentes_bp.route('/configuracoes-alertas', methods=['GET'])
def configuracoes_alertas():
    """Endpoint para obter configurações de alertas"""
    try:
        configuracoes = {
            "limites_risco": {
                "critico": 70,
                "alto": 50,
                "moderado": 30
            },
            "notificacoes": {
                "email_ativo": True,
                "push_ativo": True,
                "sms_ativo": False,
                "frequencia": "tempo_real"
            },
            "acoes_automaticas": {
                "desconto_automatico": False,
                "promocao_automatica": True,
                "alerta_fornecedor": True
            },
            "categorias_monitoradas": [
                "Laticínios",
                "Padaria",
                "Carnes",
                "Frutas",
                "Verduras",
                "Congelados"
            ]
        }
        
        return jsonify({
            "success": True,
            "configuracoes": configuracoes
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@alertas_inteligentes_bp.route('/configuracoes-alertas', methods=['PUT'])
def atualizar_configuracoes():
    """Endpoint para atualizar configurações de alertas"""
    try:
        dados = request.get_json()
        
        # Simular salvamento das configurações
        # Em um sistema real, isso seria salvo no banco de dados
        
        return jsonify({
            "success": True,
            "message": "Configurações atualizadas com sucesso",
            "configuracoes": dados
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@alertas_inteligentes_bp.route('/resolver-alerta/<int:alerta_id>', methods=['POST'])
def resolver_alerta(alerta_id):
    """Endpoint para resolver um alerta"""
    try:
        dados = request.get_json()
        acao_tomada = dados.get('acao', '')
        observacoes = dados.get('observacoes', '')
        
        # Simular resolução do alerta
        resultado = {
            "alerta_id": alerta_id,
            "status": "resolvido",
            "acao_tomada": acao_tomada,
            "observacoes": observacoes,
            "data_resolucao": datetime.now().isoformat(),
            "resolvido_por": "Sistema"  # Em um sistema real, seria o usuário logado
        }
        
        return jsonify({
            "success": True,
            "message": "Alerta resolvido com sucesso",
            "resultado": resultado
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@alertas_inteligentes_bp.route('/estatisticas-alertas', methods=['GET'])
def estatisticas_alertas():
    """Endpoint para obter estatísticas dos alertas"""
    try:
        periodo = request.args.get('periodo', '30d')
        
        # Simular estatísticas
        estatisticas = {
            "periodo": periodo,
            "total_alertas": 156,
            "alertas_resolvidos": 142,
            "alertas_pendentes": 14,
            "taxa_resolucao": 91.0,
            "economia_estimada": 2450.80,
            "perdas_evitadas": {
                "quantidade_produtos": 89,
                "valor_monetario": 1876.50
            },
            "distribuicao_tipos": {
                "critico": 12,
                "alto": 34,
                "moderado": 110
            },
            "categorias_mais_alertas": [
                {"categoria": "Laticínios", "quantidade": 45},
                {"categoria": "Padaria", "quantidade": 38},
                {"categoria": "Frutas", "quantidade": 32},
                {"categoria": "Carnes", "quantidade": 25},
                {"categoria": "Verduras", "quantidade": 16}
            ],
            "tendencia_semanal": [
                {"semana": "Sem 1", "alertas": 38},
                {"semana": "Sem 2", "alertas": 42},
                {"semana": "Sem 3", "alertas": 35},
                {"semana": "Sem 4", "alertas": 41}
            ]
        }
        
        return jsonify({
            "success": True,
            "estatisticas": estatisticas
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500