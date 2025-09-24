from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import func, and_, or_
from src.models.user import db
from src.models.produto import Produto, HistoricoVenda, Alerta
import json

relatorios_bp = Blueprint('relatorios', __name__)

@relatorios_bp.route('/relatorios/vendas', methods=['GET'])
@jwt_required()
def relatorio_vendas():
    """Relatório detalhado de vendas"""
    try:
        user_id = get_jwt_identity()
        
        # Parâmetros de filtro
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        categoria = request.args.get('categoria')
        produto_id = request.args.get('produto_id')
        formato = request.args.get('formato', 'json')  # json, csv, pdf
        
        # Definir período padrão (últimos 30 dias)
        if not data_inicio:
            data_inicio = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not data_fim:
            data_fim = datetime.now().strftime('%Y-%m-%d')
        
        # Query base
        query = db.session.query(
            HistoricoVenda,
            Produto
        ).join(
            Produto, HistoricoVenda.produto_id == Produto.id
        ).filter(
            Produto.user_id == user_id,
            HistoricoVenda.data_venda >= data_inicio,
            HistoricoVenda.data_venda <= data_fim
        )
        
        # Aplicar filtros
        if categoria:
            query = query.filter(Produto.categoria == categoria)
        if produto_id:
            query = query.filter(Produto.id == produto_id)
        
        vendas = query.all()
        
        # Processar dados
        vendas_data = []
        total_vendas = 0
        total_quantidade = 0
        produtos_vendidos = set()
        
        for venda, produto in vendas:
            venda_info = {
                'id': venda.id,
                'data_venda': venda.data_venda.strftime('%Y-%m-%d'),
                'produto_id': produto.id,
                'produto_nome': produto.nome,
                'categoria': produto.categoria,
                'quantidade_vendida': venda.quantidade_vendida,
                'preco_venda': float(venda.preco_venda),
                'valor_total': float(venda.quantidade_vendida * venda.preco_venda),
                'margem_lucro': float(venda.preco_venda - produto.preco_custo) if produto.preco_custo else 0
            }
            vendas_data.append(venda_info)
            total_vendas += venda_info['valor_total']
            total_quantidade += venda.quantidade_vendida
            produtos_vendidos.add(produto.id)
        
        # Estatísticas resumidas
        resumo = {
            'periodo': {
                'data_inicio': data_inicio,
                'data_fim': data_fim
            },
            'totais': {
                'valor_total_vendas': total_vendas,
                'quantidade_total_vendida': total_quantidade,
                'numero_vendas': len(vendas_data),
                'produtos_diferentes_vendidos': len(produtos_vendidos)
            },
            'medias': {
                'valor_medio_venda': total_vendas / len(vendas_data) if vendas_data else 0,
                'quantidade_media_venda': total_quantidade / len(vendas_data) if vendas_data else 0
            }
        }
        
        # Vendas por dia
        vendas_por_dia = {}
        for venda_info in vendas_data:
            data = venda_info['data_venda']
            if data not in vendas_por_dia:
                vendas_por_dia[data] = {'valor': 0, 'quantidade': 0, 'vendas': 0}
            vendas_por_dia[data]['valor'] += venda_info['valor_total']
            vendas_por_dia[data]['quantidade'] += venda_info['quantidade_vendida']
            vendas_por_dia[data]['vendas'] += 1
        
        # Vendas por categoria
        vendas_por_categoria = {}
        for venda_info in vendas_data:
            cat = venda_info['categoria'] or 'Sem categoria'
            if cat not in vendas_por_categoria:
                vendas_por_categoria[cat] = {'valor': 0, 'quantidade': 0, 'vendas': 0}
            vendas_por_categoria[cat]['valor'] += venda_info['valor_total']
            vendas_por_categoria[cat]['quantidade'] += venda_info['quantidade_vendida']
            vendas_por_categoria[cat]['vendas'] += 1
        
        # Top produtos
        produtos_ranking = {}
        for venda_info in vendas_data:
            produto_nome = venda_info['produto_nome']
            if produto_nome not in produtos_ranking:
                produtos_ranking[produto_nome] = {'valor': 0, 'quantidade': 0, 'vendas': 0}
            produtos_ranking[produto_nome]['valor'] += venda_info['valor_total']
            produtos_ranking[produto_nome]['quantidade'] += venda_info['quantidade_vendida']
            produtos_ranking[produto_nome]['vendas'] += 1
        
        top_produtos = sorted(produtos_ranking.items(), key=lambda x: x[1]['valor'], reverse=True)[:10]
        
        return jsonify({
            'success': True,
            'relatorio': {
                'tipo': 'vendas',
                'resumo': resumo,
                'vendas': vendas_data,
                'graficos': {
                    'vendas_por_dia': [
                        {'data': data, **valores} 
                        for data, valores in sorted(vendas_por_dia.items())
                    ],
                    'vendas_por_categoria': [
                        {'categoria': cat, **valores} 
                        for cat, valores in vendas_por_categoria.items()
                    ],
                    'top_produtos': [
                        {'produto': produto, **dados} 
                        for produto, dados in top_produtos
                    ]
                }
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@relatorios_bp.route('/relatorios/perdas', methods=['GET'])
@jwt_required()
def relatorio_perdas():
    """Relatório de perdas por vencimento"""
    try:
        user_id = get_jwt_identity()
        
        # Parâmetros
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        categoria = request.args.get('categoria')
        
        # Período padrão
        if not data_inicio:
            data_inicio = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not data_fim:
            data_fim = datetime.now().strftime('%Y-%m-%d')
        
        # Produtos vencidos no período
        produtos_vencidos = db.session.query(Produto).filter(
            Produto.user_id == user_id,
            Produto.data_validade >= data_inicio,
            Produto.data_validade <= data_fim,
            Produto.data_validade < datetime.now().date()
        )
        
        if categoria:
            produtos_vencidos = produtos_vencidos.filter(Produto.categoria == categoria)
        
        produtos_vencidos = produtos_vencidos.all()
        
        # Calcular perdas
        perdas_data = []
        valor_total_perdas = 0
        quantidade_total_perdas = 0
        
        for produto in produtos_vencidos:
            valor_perda = produto.quantidade * produto.preco_custo if produto.preco_custo else 0
            perda_info = {
                'produto_id': produto.id,
                'produto_nome': produto.nome,
                'categoria': produto.categoria,
                'data_validade': produto.data_validade.strftime('%Y-%m-%d'),
                'quantidade_perdida': produto.quantidade,
                'preco_custo': float(produto.preco_custo) if produto.preco_custo else 0,
                'valor_perda': float(valor_perda),
                'dias_vencido': (datetime.now().date() - produto.data_validade).days
            }
            perdas_data.append(perda_info)
            valor_total_perdas += valor_perda
            quantidade_total_perdas += produto.quantidade
        
        # Perdas por categoria
        perdas_por_categoria = {}
        for perda in perdas_data:
            cat = perda['categoria'] or 'Sem categoria'
            if cat not in perdas_por_categoria:
                perdas_por_categoria[cat] = {'valor': 0, 'quantidade': 0, 'produtos': 0}
            perdas_por_categoria[cat]['valor'] += perda['valor_perda']
            perdas_por_categoria[cat]['quantidade'] += perda['quantidade_perdida']
            perdas_por_categoria[cat]['produtos'] += 1
        
        # Perdas por mês
        perdas_por_mes = {}
        for perda in perdas_data:
            mes = perda['data_validade'][:7]  # YYYY-MM
            if mes not in perdas_por_mes:
                perdas_por_mes[mes] = {'valor': 0, 'quantidade': 0, 'produtos': 0}
            perdas_por_mes[mes]['valor'] += perda['valor_perda']
            perdas_por_mes[mes]['quantidade'] += perda['quantidade_perdida']
            perdas_por_mes[mes]['produtos'] += 1
        
        resumo = {
            'periodo': {
                'data_inicio': data_inicio,
                'data_fim': data_fim
            },
            'totais': {
                'valor_total_perdas': valor_total_perdas,
                'quantidade_total_perdas': quantidade_total_perdas,
                'produtos_perdidos': len(perdas_data)
            }
        }
        
        return jsonify({
            'success': True,
            'relatorio': {
                'tipo': 'perdas',
                'resumo': resumo,
                'perdas': perdas_data,
                'graficos': {
                    'perdas_por_categoria': [
                        {'categoria': cat, **valores} 
                        for cat, valores in perdas_por_categoria.items()
                    ],
                    'perdas_por_mes': [
                        {'mes': mes, **valores} 
                        for mes, valores in sorted(perdas_por_mes.items())
                    ]
                }
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@relatorios_bp.route('/relatorios/estoque', methods=['GET'])
@jwt_required()
def relatorio_estoque():
    """Relatório de estoque atual"""
    try:
        user_id = get_jwt_identity()
        categoria = request.args.get('categoria')
        status = request.args.get('status')  # ativo, vencendo, vencido
        
        # Query base
        query = db.session.query(Produto).filter(Produto.user_id == user_id)
        
        if categoria:
            query = query.filter(Produto.categoria == categoria)
        
        produtos = query.all()
        
        # Processar dados do estoque
        estoque_data = []
        valor_total_estoque = 0
        quantidade_total = 0
        produtos_ativos = 0
        produtos_vencendo = 0
        produtos_vencidos = 0
        
        hoje = datetime.now().date()
        
        for produto in produtos:
            dias_para_vencer = (produto.data_validade - hoje).days if produto.data_validade else None
            
            # Determinar status
            if produto.data_validade:
                if produto.data_validade < hoje:
                    produto_status = 'vencido'
                    produtos_vencidos += 1
                elif dias_para_vencer <= 7:
                    produto_status = 'vencendo'
                    produtos_vencendo += 1
                else:
                    produto_status = 'ativo'
                    produtos_ativos += 1
            else:
                produto_status = 'sem_validade'
                produtos_ativos += 1
            
            # Filtrar por status se especificado
            if status and produto_status != status:
                continue
            
            valor_estoque = produto.quantidade * produto.preco_custo if produto.preco_custo else 0
            
            produto_info = {
                'produto_id': produto.id,
                'nome': produto.nome,
                'categoria': produto.categoria,
                'quantidade': produto.quantidade,
                'preco_custo': float(produto.preco_custo) if produto.preco_custo else 0,
                'preco_venda': float(produto.preco_venda) if produto.preco_venda else 0,
                'valor_estoque': float(valor_estoque),
                'data_validade': produto.data_validade.strftime('%Y-%m-%d') if produto.data_validade else None,
                'dias_para_vencer': dias_para_vencer,
                'status': produto_status
            }
            
            estoque_data.append(produto_info)
            valor_total_estoque += valor_estoque
            quantidade_total += produto.quantidade
        
        # Estoque por categoria
        estoque_por_categoria = {}
        for produto in estoque_data:
            cat = produto['categoria'] or 'Sem categoria'
            if cat not in estoque_por_categoria:
                estoque_por_categoria[cat] = {'valor': 0, 'quantidade': 0, 'produtos': 0}
            estoque_por_categoria[cat]['valor'] += produto['valor_estoque']
            estoque_por_categoria[cat]['quantidade'] += produto['quantidade']
            estoque_por_categoria[cat]['produtos'] += 1
        
        # Estoque por status
        estoque_por_status = {
            'ativo': {'valor': 0, 'quantidade': 0, 'produtos': produtos_ativos},
            'vencendo': {'valor': 0, 'quantidade': 0, 'produtos': produtos_vencendo},
            'vencido': {'valor': 0, 'quantidade': 0, 'produtos': produtos_vencidos}
        }
        
        for produto in estoque_data:
            status_produto = produto['status']
            if status_produto in estoque_por_status:
                estoque_por_status[status_produto]['valor'] += produto['valor_estoque']
                estoque_por_status[status_produto]['quantidade'] += produto['quantidade']
        
        resumo = {
            'totais': {
                'valor_total_estoque': valor_total_estoque,
                'quantidade_total': quantidade_total,
                'produtos_total': len(estoque_data),
                'produtos_ativos': produtos_ativos,
                'produtos_vencendo': produtos_vencendo,
                'produtos_vencidos': produtos_vencidos
            }
        }
        
        return jsonify({
            'success': True,
            'relatorio': {
                'tipo': 'estoque',
                'resumo': resumo,
                'estoque': estoque_data,
                'graficos': {
                    'estoque_por_categoria': [
                        {'categoria': cat, **valores} 
                        for cat, valores in estoque_por_categoria.items()
                    ],
                    'estoque_por_status': [
                        {'status': status, **valores} 
                        for status, valores in estoque_por_status.items()
                    ]
                }
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@relatorios_bp.route('/relatorios/performance', methods=['GET'])
@jwt_required()
def relatorio_performance():
    """Relatório de performance e KPIs"""
    try:
        user_id = get_jwt_identity()
        
        # Parâmetros
        periodo = request.args.get('periodo', '30d')  # 7d, 30d, 90d
        
        # Definir datas
        if periodo == '7d':
            data_inicio = datetime.now() - timedelta(days=7)
        elif periodo == '90d':
            data_inicio = datetime.now() - timedelta(days=90)
        else:  # 30d
            data_inicio = datetime.now() - timedelta(days=30)
        
        # Período anterior para comparação
        periodo_anterior_inicio = data_inicio - (datetime.now() - data_inicio)
        periodo_anterior_fim = data_inicio
        
        # Vendas do período atual
        vendas_atual = db.session.query(
            func.sum(HistoricoVenda.quantidade_vendida * HistoricoVenda.preco_venda).label('total_vendas'),
            func.sum(HistoricoVenda.quantidade_vendida).label('total_quantidade'),
            func.count(HistoricoVenda.id).label('total_transacoes')
        ).join(Produto).filter(
            Produto.user_id == user_id,
            HistoricoVenda.data_venda >= data_inicio.date()
        ).first()
        
        # Vendas do período anterior
        vendas_anterior = db.session.query(
            func.sum(HistoricoVenda.quantidade_vendida * HistoricoVenda.preco_venda).label('total_vendas'),
            func.sum(HistoricoVenda.quantidade_vendida).label('total_quantidade'),
            func.count(HistoricoVenda.id).label('total_transacoes')
        ).join(Produto).filter(
            Produto.user_id == user_id,
            HistoricoVenda.data_venda >= periodo_anterior_inicio.date(),
            HistoricoVenda.data_venda < periodo_anterior_fim.date()
        ).first()
        
        # Estoque atual
        estoque_atual = db.session.query(
            func.sum(Produto.quantidade).label('total_quantidade'),
            func.sum(Produto.quantidade * Produto.preco_custo).label('valor_estoque'),
            func.count(Produto.id).label('total_produtos')
        ).filter(Produto.user_id == user_id).first()
        
        # Produtos vencidos no período
        produtos_vencidos = db.session.query(
            func.sum(Produto.quantidade).label('quantidade_perdida'),
            func.sum(Produto.quantidade * Produto.preco_custo).label('valor_perdido'),
            func.count(Produto.id).label('produtos_perdidos')
        ).filter(
            Produto.user_id == user_id,
            Produto.data_validade >= data_inicio.date(),
            Produto.data_validade < datetime.now().date()
        ).first()
        
        # Calcular KPIs
        vendas_atual_valor = float(vendas_atual.total_vendas or 0)
        vendas_anterior_valor = float(vendas_anterior.total_vendas or 0)
        
        crescimento_vendas = 0
        if vendas_anterior_valor > 0:
            crescimento_vendas = ((vendas_atual_valor - vendas_anterior_valor) / vendas_anterior_valor) * 100
        
        # Taxa de rotatividade (vendas / estoque médio)
        valor_estoque = float(estoque_atual.valor_estoque or 0)
        taxa_rotatividade = 0
        if valor_estoque > 0:
            taxa_rotatividade = (vendas_atual_valor / valor_estoque) * 100
        
        # Taxa de perda
        valor_perdido = float(produtos_vencidos.valor_perdido or 0)
        taxa_perda = 0
        if valor_estoque > 0:
            taxa_perda = (valor_perdido / valor_estoque) * 100
        
        # Ticket médio
        ticket_medio = 0
        if vendas_atual.total_transacoes and vendas_atual.total_transacoes > 0:
            ticket_medio = vendas_atual_valor / vendas_atual.total_transacoes
        
        kpis = {
            'vendas': {
                'atual': vendas_atual_valor,
                'anterior': vendas_anterior_valor,
                'crescimento': crescimento_vendas
            },
            'rotatividade': {
                'taxa': taxa_rotatividade,
                'periodo': periodo
            },
            'perdas': {
                'valor': valor_perdido,
                'taxa': taxa_perda,
                'quantidade': int(produtos_vencidos.quantidade_perdida or 0)
            },
            'ticket_medio': {
                'valor': ticket_medio,
                'transacoes': int(vendas_atual.total_transacoes or 0)
            },
            'estoque': {
                'valor': valor_estoque,
                'quantidade': int(estoque_atual.total_quantidade or 0),
                'produtos': int(estoque_atual.total_produtos or 0)
            }
        }
        
        return jsonify({
            'success': True,
            'relatorio': {
                'tipo': 'performance',
                'periodo': periodo,
                'kpis': kpis
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@relatorios_bp.route('/relatorios/categorias', methods=['GET'])
@jwt_required()
def get_categorias_relatorio():
    """Obter categorias disponíveis para filtros"""
    try:
        user_id = get_jwt_identity()
        
        categorias = db.session.query(Produto.categoria).filter(
            Produto.user_id == user_id,
            Produto.categoria.isnot(None)
        ).distinct().all()
        
        categorias_list = [cat[0] for cat in categorias if cat[0]]
        
        return jsonify({
            'success': True,
            'categorias': categorias_list
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500