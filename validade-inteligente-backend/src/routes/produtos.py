from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.produto import Produto, Alerta, HistoricoVenda, db
from datetime import datetime, timedelta

produtos_bp = Blueprint('produtos', __name__)

@produtos_bp.route('/produtos', methods=['GET'])
@jwt_required()
def get_produtos():
    """Listar todos os produtos"""
    try:
        produtos = Produto.query.all()
        return jsonify([{
            'id': produto.id,
            'nome': produto.nome,
            'categoria': produto.categoria,
            'preco': float(produto.preco) if produto.preco else None,
            'quantidade_estoque': produto.quantidade_estoque,
            'data_validade': produto.data_validade.isoformat() if produto.data_validade else None,
            'codigo_barras': produto.codigo_barras,
            'fornecedor': produto.fornecedor,
            'localizacao': produto.localizacao,
            'created_at': produto.created_at.isoformat() if produto.created_at else None
        } for produto in produtos]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@produtos_bp.route('', methods=['POST'])
@jwt_required()
def create_produto():
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        # Validação dos campos obrigatórios
        required_fields = ['nome', 'categoria', 'data_validade', 'preco_venda']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Converter data_validade para objeto date
        try:
            data_validade = datetime.strptime(data['data_validade'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        produto = Produto(
            user_id=current_user_id,
            nome=data['nome'],
            categoria=data['categoria'],
            data_validade=data_validade,
            preco_venda=float(data['preco_venda']),
            codigo_barras=data.get('codigo_barras'),
            lote=data.get('lote'),
            quantidade=int(data.get('quantidade', 0)),
            preco_custo=float(data['preco_custo']) if data.get('preco_custo') else None,
            fornecedor=data.get('fornecedor')
        )
        
        produto.atualizar_status()
        
        db.session.add(produto)
        db.session.commit()
        
        return jsonify(produto.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@produtos_bp.route('/produtos/<int:produto_id>', methods=['GET'])
@jwt_required()
def get_produto(produto_id):
    """Obter produto específico"""
    try:
        produto = Produto.query.get_or_404(produto_id)
        return jsonify({
            'id': produto.id,
            'nome': produto.nome,
            'categoria': produto.categoria,
            'preco': float(produto.preco) if produto.preco else None,
            'quantidade_estoque': produto.quantidade_estoque,
            'data_validade': produto.data_validade.isoformat() if produto.data_validade else None,
            'codigo_barras': produto.codigo_barras,
            'fornecedor': produto.fornecedor,
            'localizacao': produto.localizacao,
            'created_at': produto.created_at.isoformat() if produto.created_at else None
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@produtos_bp.route('/<int:produto_id>', methods=['PUT'])
@jwt_required()
def update_produto(produto_id):
    try:
        current_user_id = get_jwt_identity()
        produto = Produto.query.filter_by(id=produto_id, user_id=current_user_id).first()
        
        if not produto:
            return jsonify({'error': 'Produto não encontrado'}), 404
        
        data = request.get_json()
        
        # Atualizar campos se fornecidos
        if 'nome' in data:
            produto.nome = data['nome']
        if 'categoria' in data:
            produto.categoria = data['categoria']
        if 'preco_venda' in data:
            produto.preco_venda = float(data['preco_venda'])
        if 'quantidade' in data:
            produto.quantidade = int(data['quantidade'])
        if 'data_validade' in data:
            try:
                produto.data_validade = datetime.strptime(data['data_validade'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        if 'codigo_barras' in data:
            produto.codigo_barras = data['codigo_barras']
        if 'lote' in data:
            produto.lote = data['lote']
        if 'preco_custo' in data:
            produto.preco_custo = float(data['preco_custo']) if data['preco_custo'] else None
        if 'fornecedor' in data:
            produto.fornecedor = data['fornecedor']
        
        produto.atualizar_status()
        produto.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(produto.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@produtos_bp.route('/produtos/<int:produto_id>', methods=['DELETE'])
@jwt_required()
def delete_produto(produto_id):
    """Deletar produto"""
    try:
        produto = Produto.query.get_or_404(produto_id)
        db.session.delete(produto)
        db.session.commit()
        return jsonify({'message': 'Produto deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@produtos_bp.route('/produtos/vencendo', methods=['GET'])
@jwt_required()
def get_produtos_vencendo():
    """Obter produtos próximos ao vencimento"""
    try:
        dias = request.args.get('dias', 7, type=int)
        data_limite = datetime.now() + timedelta(days=dias)
        
        produtos = Produto.query.filter(
            Produto.data_validade <= data_limite,
            Produto.data_validade >= datetime.now()
        ).all()
        
        return jsonify([{
            'id': produto.id,
            'nome': produto.nome,
            'categoria': produto.categoria,
            'data_validade': produto.data_validade.isoformat(),
            'dias_para_vencer': (produto.data_validade - datetime.now()).days,
            'quantidade_estoque': produto.quantidade_estoque
        } for produto in produtos]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@produtos_bp.route('/alertas', methods=['GET'])
@jwt_required()
def get_alertas():
    """Obter alertas de produtos"""
    try:
        alertas = Alerta.query.order_by(Alerta.created_at.desc()).all()
        return jsonify([{
            'id': alerta.id,
            'produto_id': alerta.produto_id,
            'tipo': alerta.tipo,
            'mensagem': alerta.mensagem,
            'resolvido': alerta.resolvido,
            'created_at': alerta.created_at.isoformat() if alerta.created_at else None
        } for alerta in alertas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500