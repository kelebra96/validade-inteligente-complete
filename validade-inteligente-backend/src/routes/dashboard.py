from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta, date
from sqlalchemy import func, and_, or_
from src.models.user import db
from src.models.produto import Produto, Alerta, HistoricoVenda, Gamificacao

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Obtém dados completos do dashboard"""
    try:
        current_user_id = get_jwt_identity()
        periodo = request.args.get('periodo', '30d')
        
        # Calcular datas
        hoje = date.today()
        if periodo == '7d':
            data_inicio = hoje - timedelta(days=7)
        elif periodo == '30d':
            data_inicio = hoje - timedelta(days=30)
        elif periodo == '90d':
            data_inicio = hoje - timedelta(days=90)
        else:
            data_inicio = hoje - timedelta(days=30)
        
        # Resumo geral
        resumo = get_resumo_dashboard(current_user_id, data_inicio, hoje)
        
        # Gráficos
        graficos = get_graficos_dashboard(current_user_id, data_inicio, hoje)
        
        # Métricas de performance
        metricas = get_metricas_performance(current_user_id, data_inicio, hoje)
        
        # Alertas recentes
        alertas_recentes = get_alertas_recentes(current_user_id)
        
        # Produtos críticos
        produtos_criticos = get_produtos_criticos(current_user_id)
        
        # Tendências
        tendencias = get_tendencias(current_user_id, data_inicio, hoje)
        
        dashboard_data = {
            'resumo': resumo,
            'graficos': graficos,
            'metricas': metricas,
            'alertas_recentes': alertas_recentes,
            'produtos_criticos': produtos_criticos,
            'tendencias': tendencias,
            'periodo': periodo,
            'data_atualizacao': datetime.utcnow().isoformat()
        }
        
        return jsonify(dashboard_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_resumo_dashboard(user_id, data_inicio, data_fim):
    """Obtém resumo geral do dashboard"""
    
    # Total de produtos
    total_produtos = Produto.query.filter_by(user_id=user_id).count()
    
    # Produtos vencendo (próximos 7 dias)
    data_limite = data_fim + timedelta(days=7)
    produtos_vencendo = Produto.query.filter(
        and_(
            Produto.user_id == user_id,
            Produto.data_validade <= data_limite,
            Produto.data_validade >= data_fim
        )
    ).count()
    
    # Produtos vencidos
    produtos_vencidos = Produto.query.filter(
        and_(
            Produto.user_id == user_id,
            Produto.data_validade < data_fim
        )
    ).count()
    
    # Valor em risco (produtos vencendo)
    valor_risco = db.session.query(func.sum(Produto.preco_venda * Produto.quantidade)).filter(
        and_(
            Produto.user_id == user_id,
            Produto.data_validade <= data_limite,
            Produto.data_validade >= data_fim
        )
    ).scalar() or 0
    
    # Vendas do período
    vendas_periodo = db.session.query(func.sum(HistoricoVenda.receita_total)).filter(
        and_(
            HistoricoVenda.user_id == user_id,
            HistoricoVenda.data_venda >= data_inicio,
            HistoricoVenda.data_venda <= data_fim
        )
    ).scalar() or 0
    
    # Economia estimada (produtos salvos do desperdício)
    economia_mes = vendas_periodo * 0.15  # Estimativa de 15% de economia
    
    # Redução de desperdício
    reducao_desperdicio = 0.12  # 12% de redução estimada
    
    # Alertas ativos
    alertas_ativos = Alerta.query.filter(
        and_(
            Alerta.user_id == user_id,
            Alerta.status == 'ativo'
        )
    ).count()
    
    return {
        'total_produtos': total_produtos,
        'produtos_vencendo': produtos_vencendo,
        'produtos_vencidos': produtos_vencidos,
        'valor_risco': float(valor_risco),
        'vendas_periodo': float(vendas_periodo),
        'economia_mes': float(economia_mes),
        'reducao_desperdicio': reducao_desperdicio,
        'alertas_ativos': alertas_ativos
    }

def get_graficos_dashboard(user_id, data_inicio, data_fim):
    """Obtém dados para gráficos do dashboard"""
    
    # Vendas por dia (últimos 7 dias)
    vendas_por_dia = []
    for i in range(7):
        data = data_fim - timedelta(days=i)
        vendas_dia = db.session.query(func.sum(HistoricoVenda.receita_total)).filter(
            and_(
                HistoricoVenda.user_id == user_id,
                HistoricoVenda.data_venda == data
            )
        ).scalar() or 0
        
        vendas_por_dia.append({
            'data': data.strftime('%d/%m'),
            'vendas': float(vendas_dia)
        })
    
    vendas_por_dia.reverse()
    
    # Produtos por categoria
    produtos_por_categoria = db.session.query(
        Produto.categoria,
        func.count(Produto.id).label('quantidade')
    ).filter(
        Produto.user_id == user_id
    ).group_by(Produto.categoria).all()
    
    produtos_categoria_data = [
        {'categoria': cat, 'quantidade': qtd}
        for cat, qtd in produtos_por_categoria
    ]
    
    # Alertas por urgência
    alertas_urgencia = db.session.query(
        Alerta.urgencia,
        func.count(Alerta.id).label('quantidade')
    ).filter(
        and_(
            Alerta.user_id == user_id,
            Alerta.status == 'ativo'
        )
    ).group_by(Alerta.urgencia).all()
    
    alertas_por_urgencia = {
        'alta': 0,
        'media': 0,
        'baixa': 0
    }
    
    for urgencia, qtd in alertas_urgencia:
        alertas_por_urgencia[urgencia] = qtd
    
    # Evolução do estoque (últimos 30 dias)
    evolucao_estoque = []
    for i in range(30, 0, -5):  # A cada 5 dias
        data = data_fim - timedelta(days=i)
        total_estoque = db.session.query(func.sum(Produto.quantidade)).filter(
            and_(
                Produto.user_id == user_id,
                Produto.created_at <= data
            )
        ).scalar() or 0
        
        evolucao_estoque.append({
            'data': data.strftime('%d/%m'),
            'estoque': int(total_estoque)
        })
    
    return {
        'vendas_por_dia': vendas_por_dia,
        'produtos_por_categoria': produtos_categoria_data,
        'alertas_por_urgencia': alertas_por_urgencia,
        'evolucao_estoque': evolucao_estoque
    }

def get_metricas_performance(user_id, data_inicio, data_fim):
    """Obtém métricas de performance"""
    
    # Taxa de desperdício
    produtos_vencidos = Produto.query.filter(
        and_(
            Produto.user_id == user_id,
            Produto.data_validade < data_fim
        )
    ).count()
    
    total_produtos = Produto.query.filter_by(user_id=user_id).count()
    taxa_desperdicio = (produtos_vencidos / total_produtos * 100) if total_produtos > 0 else 0
    
    # Tempo médio de resolução de alertas
    alertas_resolvidos = Alerta.query.filter(
        and_(
            Alerta.user_id == user_id,
            Alerta.status == 'resolvido',
            Alerta.resolved_at.isnot(None)
        )
    ).all()
    
    tempo_medio_resolucao = 0
    if alertas_resolvidos:
        tempos = [(alerta.resolved_at - alerta.created_at).days for alerta in alertas_resolvidos]
        tempo_medio_resolucao = sum(tempos) / len(tempos)
    
    # Eficiência de vendas
    vendas_realizadas = HistoricoVenda.query.filter(
        and_(
            HistoricoVenda.user_id == user_id,
            HistoricoVenda.data_venda >= data_inicio
        )
    ).count()
    
    eficiencia_vendas = min(100, (vendas_realizadas / 30) * 100)  # Meta de 30 vendas/mês
    
    return {
        'taxa_desperdicio': round(taxa_desperdicio, 2),
        'tempo_medio_resolucao': round(tempo_medio_resolucao, 1),
        'eficiencia_vendas': round(eficiencia_vendas, 1),
        'score_geral': round((100 - taxa_desperdicio + eficiencia_vendas) / 2, 1)
    }

def get_alertas_recentes(user_id, limit=5):
    """Obtém alertas mais recentes"""
    alertas = Alerta.query.filter(
        and_(
            Alerta.user_id == user_id,
            Alerta.status == 'ativo'
        )
    ).order_by(Alerta.created_at.desc()).limit(limit).all()
    
    return [alerta.to_dict() for alerta in alertas]

def get_produtos_criticos(user_id, limit=10):
    """Obtém produtos em situação crítica"""
    hoje = date.today()
    data_limite = hoje + timedelta(days=3)  # Próximos 3 dias
    
    produtos = Produto.query.filter(
        and_(
            Produto.user_id == user_id,
            Produto.data_validade <= data_limite,
            Produto.quantidade > 0
        )
    ).order_by(Produto.data_validade.asc()).limit(limit).all()
    
    return [produto.to_dict() for produto in produtos]

def get_tendencias(user_id, data_inicio, data_fim):
    """Obtém tendências e insights"""
    
    # Categoria com mais produtos vencendo
    categoria_risco = db.session.query(
        Produto.categoria,
        func.count(Produto.id).label('quantidade')
    ).filter(
        and_(
            Produto.user_id == user_id,
            Produto.data_validade <= data_fim + timedelta(days=7)
        )
    ).group_by(Produto.categoria).order_by(func.count(Produto.id).desc()).first()
    
    # Dia da semana com mais vendas
    vendas_por_dia_semana = db.session.query(
        func.extract('dow', HistoricoVenda.data_venda).label('dia_semana'),
        func.count(HistoricoVenda.id).label('vendas')
    ).filter(
        and_(
            HistoricoVenda.user_id == user_id,
            HistoricoVenda.data_venda >= data_inicio
        )
    ).group_by('dia_semana').order_by(func.count(HistoricoVenda.id).desc()).first()
    
    dias_semana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    melhor_dia_vendas = dias_semana[int(vendas_por_dia_semana[0])] if vendas_por_dia_semana else 'N/A'
    
    return {
        'categoria_maior_risco': categoria_risco[0] if categoria_risco else 'N/A',
        'melhor_dia_vendas': melhor_dia_vendas,
        'crescimento_vendas': 15.5,  # Simulado - calcular baseado em dados reais
        'previsao_economia': 2500.00  # Simulado - usar IA preditiva
    }