from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random
import math

ia_preditiva_bp = Blueprint('ia_preditiva', __name__)

def gerar_previsao_demanda(produto_id, historico_vendas, sazonalidade=None):
    """Simula algoritmo de previsão de demanda usando tendências e sazonalidade"""
    if not historico_vendas:
        return {"demanda_prevista": 0, "confianca": 0}
    
    # Calcular tendência baseada nos últimos dados
    vendas_recentes = historico_vendas[-7:]  # Últimos 7 períodos
    vendas_antigas = historico_vendas[-14:-7] if len(historico_vendas) >= 14 else historico_vendas[:-7]
    
    if vendas_antigas:
        tendencia = (sum(vendas_recentes) / len(vendas_recentes)) / (sum(vendas_antigas) / len(vendas_antigas))
    else:
        tendencia = 1.0
    
    # Aplicar sazonalidade (simulada)
    fator_sazonal = 1.0
    if sazonalidade:
        mes_atual = datetime.now().month
        if mes_atual in [11, 12]:  # Novembro/Dezembro - alta demanda
            fator_sazonal = 1.3
        elif mes_atual in [1, 2]:  # Janeiro/Fevereiro - baixa demanda
            fator_sazonal = 0.8
    
    # Calcular previsão
    media_vendas = sum(historico_vendas) / len(historico_vendas)
    demanda_prevista = int(media_vendas * tendencia * fator_sazonal)
    
    # Calcular confiança baseada na variabilidade dos dados
    variancia = sum([(x - media_vendas) ** 2 for x in historico_vendas]) / len(historico_vendas)
    confianca = max(0.5, min(0.95, 1 - (variancia / (media_vendas ** 2))))
    
    return {
        "demanda_prevista": demanda_prevista,
        "confianca": round(confianca * 100, 1),
        "tendencia": "crescente" if tendencia > 1.1 else "decrescente" if tendencia < 0.9 else "estável",
        "fator_sazonal": round(fator_sazonal, 2)
    }

@ia_preditiva_bp.route('/previsao-demanda', methods=['GET'])
def previsao_demanda():
    """Endpoint para previsão de demanda de produtos"""
    try:
        periodo = request.args.get('periodo', '30d')
        categoria = request.args.get('categoria', '')
        
        # Simular dados de produtos com histórico de vendas
        produtos_previsao = []
        
        for i in range(1, 16):  # 15 produtos
            # Gerar histórico de vendas simulado
            historico = [random.randint(5, 50) for _ in range(30)]
            
            previsao = gerar_previsao_demanda(i, historico, sazonalidade=True)
            
            produto = {
                "id": i,
                "nome": f"Produto {i}",
                "categoria": random.choice(["Eletrônicos", "Roupas", "Casa", "Esporte", "Livros"]),
                "estoque_atual": random.randint(10, 100),
                "vendas_mes_atual": sum(historico[-7:]),
                "previsao_proximos_7_dias": previsao["demanda_prevista"],
                "previsao_proximos_30_dias": previsao["demanda_prevista"] * 4,
                "confianca_previsao": previsao["confianca"],
                "tendencia": previsao["tendencia"],
                "recomendacao": "aumentar_estoque" if previsao["demanda_prevista"] > 30 else "manter_estoque" if previsao["demanda_prevista"] > 15 else "reduzir_estoque",
                "risco_ruptura": "alto" if previsao["demanda_prevista"] > 40 else "médio" if previsao["demanda_prevista"] > 20 else "baixo",
                "historico_vendas": historico[-14:]  # Últimas 2 semanas
            }
            
            if not categoria or produto["categoria"] == categoria:
                produtos_previsao.append(produto)
        
        # Estatísticas gerais
        total_produtos = len(produtos_previsao)
        produtos_risco_alto = len([p for p in produtos_previsao if p["risco_ruptura"] == "alto"])
        produtos_crescimento = len([p for p in produtos_previsao if p["tendencia"] == "crescente"])
        
        return jsonify({
            "success": True,
            "produtos": produtos_previsao,
            "estatisticas": {
                "total_produtos_analisados": total_produtos,
                "produtos_risco_ruptura": produtos_risco_alto,
                "produtos_tendencia_crescente": produtos_crescimento,
                "acuracia_media": round(sum([p["confianca_previsao"] for p in produtos_previsao]) / total_produtos, 1),
                "periodo_analise": periodo
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@ia_preditiva_bp.route('/analise-sazonalidade', methods=['GET'])
def analise_sazonalidade():
    """Endpoint para análise de sazonalidade de vendas"""
    try:
        # Simular dados de sazonalidade por mês
        meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
                "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        
        sazonalidade_data = []
        for i, mes in enumerate(meses):
            # Simular padrões sazonais
            base_vendas = 100
            if i in [10, 11]:  # Nov/Dez - alta temporada
                multiplicador = random.uniform(1.5, 2.0)
            elif i in [0, 1]:  # Jan/Fev - baixa temporada
                multiplicador = random.uniform(0.6, 0.8)
            else:
                multiplicador = random.uniform(0.9, 1.2)
            
            vendas = int(base_vendas * multiplicador)
            
            sazonalidade_data.append({
                "mes": mes,
                "vendas": vendas,
                "indice_sazonal": round(multiplicador, 2),
                "categoria_principal": random.choice(["Eletrônicos", "Roupas", "Casa"]),
                "crescimento_ano_anterior": round(random.uniform(-15, 25), 1)
            })
        
        # Identificar padrões
        picos_vendas = sorted(sazonalidade_data, key=lambda x: x["vendas"], reverse=True)[:3]
        vales_vendas = sorted(sazonalidade_data, key=lambda x: x["vendas"])[:3]
        
        return jsonify({
            "success": True,
            "dados_sazonalidade": sazonalidade_data,
            "insights": {
                "meses_pico": [p["mes"] for p in picos_vendas],
                "meses_baixa": [v["mes"] for v in vales_vendas],
                "variacao_sazonal": round(max([s["indice_sazonal"] for s in sazonalidade_data]) - 
                                        min([s["indice_sazonal"] for s in sazonalidade_data]), 2),
                "recomendacoes": [
                    "Aumentar estoque em outubro para preparar alta temporada",
                    "Promoções em janeiro/fevereiro para estimular vendas",
                    "Planejamento de compras baseado em padrões históricos"
                ]
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@ia_preditiva_bp.route('/recomendacoes-inteligentes', methods=['GET'])
def recomendacoes_inteligentes():
    """Endpoint para recomendações inteligentes baseadas em IA"""
    try:
        tipo_recomendacao = request.args.get('tipo', 'geral')
        
        recomendacoes = []
        
        if tipo_recomendacao in ['geral', 'estoque']:
            recomendacoes.extend([
                {
                    "id": 1,
                    "tipo": "estoque",
                    "prioridade": "alta",
                    "titulo": "Reabastecer Produto A",
                    "descricao": "Baseado na análise preditiva, o Produto A terá alta demanda nos próximos 7 dias",
                    "acao_recomendada": "Aumentar estoque em 40%",
                    "impacto_estimado": "Evitar perda de R$ 2.500 em vendas",
                    "confianca": 87.5,
                    "prazo": "2 dias"
                },
                {
                    "id": 2,
                    "tipo": "estoque",
                    "prioridade": "média",
                    "titulo": "Reduzir Estoque Produto B",
                    "descricao": "Tendência de queda na demanda identificada",
                    "acao_recomendada": "Reduzir pedidos em 25%",
                    "impacto_estimado": "Economia de R$ 1.200 em custos de armazenagem",
                    "confianca": 73.2,
                    "prazo": "1 semana"
                }
            ])
        
        if tipo_recomendacao in ['geral', 'vendas']:
            recomendacoes.extend([
                {
                    "id": 3,
                    "tipo": "vendas",
                    "prioridade": "alta",
                    "titulo": "Promoção Estratégica",
                    "descricao": "Produtos com baixa rotação podem ser impulsionados com desconto de 15%",
                    "acao_recomendada": "Criar campanha promocional",
                    "impacto_estimado": "Aumento de 30% nas vendas destes produtos",
                    "confianca": 82.1,
                    "prazo": "3 dias"
                }
            ])
        
        if tipo_recomendacao in ['geral', 'otimizacao']:
            recomendacoes.extend([
                {
                    "id": 4,
                    "tipo": "otimizacao",
                    "prioridade": "média",
                    "titulo": "Otimizar Layout de Estoque",
                    "descricao": "Produtos de alta rotação devem ficar em locais de fácil acesso",
                    "acao_recomendada": "Reorganizar disposição física",
                    "impacto_estimado": "Redução de 20% no tempo de separação",
                    "confianca": 91.3,
                    "prazo": "1 semana"
                }
            ])
        
        # Métricas de performance da IA
        metricas_ia = {
            "acuracia_previsoes": 84.7,
            "recomendacoes_implementadas": 23,
            "economia_gerada": 15750.00,
            "tempo_economia": "2.5 horas/dia",
            "satisfacao_usuario": 4.6
        }
        
        return jsonify({
            "success": True,
            "recomendacoes": recomendacoes,
            "metricas_ia": metricas_ia,
            "total_recomendacoes": len(recomendacoes)
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@ia_preditiva_bp.route('/analise-tendencias', methods=['GET'])
def analise_tendencias():
    """Endpoint para análise de tendências de mercado"""
    try:
        # Simular análise de tendências
        tendencias = [
            {
                "categoria": "Eletrônicos",
                "tendencia": "crescente",
                "percentual_crescimento": 15.3,
                "fatores": ["Black Friday se aproximando", "Lançamento de novos produtos"],
                "previsao_3_meses": "alta demanda",
                "confianca": 89.2
            },
            {
                "categoria": "Roupas",
                "tendencia": "sazonal",
                "percentual_crescimento": -5.7,
                "fatores": ["Mudança de estação", "Liquidação de inverno"],
                "previsao_3_meses": "estabilização",
                "confianca": 76.8
            },
            {
                "categoria": "Casa e Jardim",
                "tendencia": "estável",
                "percentual_crescimento": 2.1,
                "fatores": ["Demanda constante", "Produtos essenciais"],
                "previsao_3_meses": "crescimento moderado",
                "confianca": 82.5
            }
        ]
        
        # Insights gerais do mercado
        insights_mercado = {
            "sentimento_geral": "otimista",
            "volatilidade": "baixa",
            "oportunidades": [
                "Investir em eletrônicos para aproveitar alta temporada",
                "Liquidar estoque de roupas de inverno",
                "Manter estratégia atual para casa e jardim"
            ],
            "riscos": [
                "Possível saturação no mercado de eletrônicos",
                "Mudanças climáticas afetando sazonalidade"
            ]
        }
        
        return jsonify({
            "success": True,
            "tendencias": tendencias,
            "insights_mercado": insights_mercado,
            "data_analise": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500