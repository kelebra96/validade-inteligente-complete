from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

gamificacao_bp = Blueprint('gamificacao', __name__)

# Dados simulados para demonstração
usuarios_pontos = [
    {"id": 1, "nome": "Ana Silva", "pontos": 2850, "nivel": "Expert", "avatar": "👩‍💼", "badges": ["🏆", "⭐", "🎯", "🔥"]},
    {"id": 2, "nome": "Carlos Santos", "pontos": 2340, "nivel": "Avançado", "avatar": "👨‍💻", "badges": ["⭐", "🎯", "🔥"]},
    {"id": 3, "nome": "Maria Oliveira", "pontos": 1890, "nivel": "Intermediário", "avatar": "👩‍🔬", "badges": ["🎯", "🔥"]},
    {"id": 4, "nome": "João Costa", "pontos": 1650, "nivel": "Intermediário", "avatar": "👨‍🏭", "badges": ["🔥"]},
    {"id": 5, "nome": "Lucia Ferreira", "pontos": 1420, "nivel": "Iniciante", "avatar": "👩‍🎓", "badges": ["🔥"]},
    {"id": 6, "nome": "Pedro Almeida", "pontos": 1180, "nivel": "Iniciante", "avatar": "👨‍🔧", "badges": []},
    {"id": 7, "nome": "Sofia Rodrigues", "pontos": 980, "nivel": "Iniciante", "avatar": "👩‍🍳", "badges": []},
    {"id": 8, "nome": "Miguel Torres", "pontos": 750, "nivel": "Novato", "avatar": "👨‍🎨", "badges": []}
]

badges_disponiveis = [
    {"id": "primeiro_login", "nome": "Primeiro Login", "emoji": "🚀", "descricao": "Fez o primeiro login no sistema", "pontos": 50},
    {"id": "organizador", "nome": "Organizador", "emoji": "📋", "descricao": "Organizou mais de 100 produtos", "pontos": 200},
    {"id": "vigilante", "nome": "Vigilante", "emoji": "👁️", "descricao": "Identificou 50 produtos próximos ao vencimento", "pontos": 300},
    {"id": "eficiente", "nome": "Eficiente", "emoji": "⚡", "descricao": "Processou 500 itens em um dia", "pontos": 400},
    {"id": "expert", "nome": "Expert", "emoji": "🏆", "descricao": "Alcançou 2000 pontos", "pontos": 500},
    {"id": "estrela", "nome": "Estrela", "emoji": "⭐", "descricao": "Manteve 95% de precisão por 30 dias", "pontos": 600},
    {"id": "mestre", "nome": "Mestre", "emoji": "🎯", "descricao": "Completou todos os desafios mensais", "pontos": 700},
    {"id": "lenda", "nome": "Lenda", "emoji": "🔥", "descricao": "Está no top 3 do ranking por 3 meses", "pontos": 1000}
]

desafios_ativos = [
    {
        "id": 1,
        "titulo": "Verificação Diária",
        "descricao": "Verifique pelo menos 50 produtos hoje",
        "progresso": 32,
        "meta": 50,
        "pontos": 100,
        "tipo": "diario",
        "expira_em": "23:59",
        "icone": "📦"
    },
    {
        "id": 2,
        "titulo": "Caçador de Vencimentos",
        "descricao": "Identifique 10 produtos próximos ao vencimento",
        "progresso": 7,
        "meta": 10,
        "pontos": 150,
        "tipo": "diario",
        "expira_em": "23:59",
        "icone": "🎯"
    },
    {
        "id": 3,
        "titulo": "Organizador Semanal",
        "descricao": "Organize 200 produtos esta semana",
        "progresso": 145,
        "meta": 200,
        "pontos": 300,
        "tipo": "semanal",
        "expira_em": "Domingo",
        "icone": "📋"
    },
    {
        "id": 4,
        "titulo": "Mestre da Eficiência",
        "descricao": "Mantenha 90% de precisão este mês",
        "progresso": 87,
        "meta": 90,
        "pontos": 500,
        "tipo": "mensal",
        "expira_em": "31/12",
        "icone": "⚡"
    }
]

def calcular_nivel(pontos):
    """Calcula o nível baseado nos pontos"""
    if pontos >= 2500:
        return "Expert"
    elif pontos >= 2000:
        return "Avançado"
    elif pontos >= 1500:
        return "Intermediário"
    elif pontos >= 1000:
        return "Iniciante"
    else:
        return "Novato"

def gerar_estatisticas_usuario(usuario_id=1):
    """Gera estatísticas detalhadas do usuário"""
    return {
        "pontos_totais": 2850,
        "nivel_atual": "Expert",
        "proximo_nivel": "Lenda",
        "pontos_proximo_nivel": 3500,
        "badges_conquistadas": 4,
        "total_badges": 8,
        "posicao_ranking": 1,
        "total_usuarios": len(usuarios_pontos),
        "pontos_hoje": 120,
        "pontos_semana": 450,
        "pontos_mes": 1200,
        "streak_dias": 15,
        "melhor_streak": 28,
        "desafios_completados": 12,
        "desafios_disponiveis": len(desafios_ativos)
    }

@gamificacao_bp.route('/ranking', methods=['GET'])
def get_ranking():
    """Retorna o ranking de usuários"""
    try:
        # Ordena usuários por pontos
        ranking = sorted(usuarios_pontos, key=lambda x: x['pontos'], reverse=True)
        
        # Adiciona posição no ranking
        for i, usuario in enumerate(ranking):
            usuario['posicao'] = i + 1
        
        return jsonify({
            "success": True,
            "data": ranking,
            "total_usuarios": len(ranking)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gamificacao_bp.route('/perfil/<int:usuario_id>', methods=['GET'])
def get_perfil_usuario(usuario_id):
    """Retorna o perfil detalhado do usuário"""
    try:
        # Busca usuário
        usuario = next((u for u in usuarios_pontos if u['id'] == usuario_id), None)
        if not usuario:
            return jsonify({"success": False, "error": "Usuário não encontrado"}), 404
        
        # Gera estatísticas
        stats = gerar_estatisticas_usuario(usuario_id)
        
        perfil = {
            **usuario,
            "estatisticas": stats,
            "badges_detalhadas": [
                badge for badge in badges_disponiveis 
                if badge['emoji'] in usuario['badges']
            ]
        }
        
        return jsonify({
            "success": True,
            "data": perfil
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gamificacao_bp.route('/badges', methods=['GET'])
def get_badges():
    """Retorna todas as badges disponíveis"""
    try:
        return jsonify({
            "success": True,
            "data": badges_disponiveis
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gamificacao_bp.route('/desafios', methods=['GET'])
def get_desafios():
    """Retorna desafios ativos"""
    try:
        return jsonify({
            "success": True,
            "data": desafios_ativos
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gamificacao_bp.route('/adicionar-pontos', methods=['POST'])
def adicionar_pontos():
    """Adiciona pontos para um usuário"""
    try:
        data = request.get_json()
        usuario_id = data.get('usuario_id', 1)
        pontos = data.get('pontos', 0)
        acao = data.get('acao', 'Ação realizada')
        
        # Busca usuário
        usuario = next((u for u in usuarios_pontos if u['id'] == usuario_id), None)
        if not usuario:
            return jsonify({"success": False, "error": "Usuário não encontrado"}), 404
        
        # Adiciona pontos
        usuario['pontos'] += pontos
        usuario['nivel'] = calcular_nivel(usuario['pontos'])
        
        # Verifica se ganhou nova badge
        nova_badge = None
        if usuario['pontos'] >= 2000 and "🏆" not in usuario['badges']:
            usuario['badges'].append("🏆")
            nova_badge = "Expert"
        
        return jsonify({
            "success": True,
            "data": {
                "pontos_adicionados": pontos,
                "pontos_totais": usuario['pontos'],
                "nivel": usuario['nivel'],
                "nova_badge": nova_badge,
                "acao": acao
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gamificacao_bp.route('/completar-desafio/<int:desafio_id>', methods=['POST'])
def completar_desafio(desafio_id):
    """Completa um desafio"""
    try:
        # Busca desafio
        desafio = next((d for d in desafios_ativos if d['id'] == desafio_id), None)
        if not desafio:
            return jsonify({"success": False, "error": "Desafio não encontrado"}), 404
        
        # Marca como completado
        desafio['progresso'] = desafio['meta']
        
        # Adiciona pontos ao usuário (assumindo usuário ID 1)
        usuario = usuarios_pontos[0]
        usuario['pontos'] += desafio['pontos']
        usuario['nivel'] = calcular_nivel(usuario['pontos'])
        
        return jsonify({
            "success": True,
            "data": {
                "desafio_completado": desafio['titulo'],
                "pontos_ganhos": desafio['pontos'],
                "pontos_totais": usuario['pontos']
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@gamificacao_bp.route('/estatisticas-gerais', methods=['GET'])
def get_estatisticas_gerais():
    """Retorna estatísticas gerais do sistema de gamificação"""
    try:
        total_pontos = sum(u['pontos'] for u in usuarios_pontos)
        media_pontos = total_pontos / len(usuarios_pontos)
        
        # Distribuição por nível
        niveis = {}
        for usuario in usuarios_pontos:
            nivel = usuario['nivel']
            niveis[nivel] = niveis.get(nivel, 0) + 1
        
        return jsonify({
            "success": True,
            "data": {
                "total_usuarios": len(usuarios_pontos),
                "total_pontos_sistema": total_pontos,
                "media_pontos": round(media_pontos, 2),
                "distribuicao_niveis": niveis,
                "badges_ativas": len(badges_disponiveis),
                "desafios_ativos": len(desafios_ativos),
                "usuario_top": usuarios_pontos[0]['nome'] if usuarios_pontos else None
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500