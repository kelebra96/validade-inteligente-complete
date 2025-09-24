from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.user import User, db

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    """Listar todos os usuários"""
    try:
        users = User.query.all()
        return jsonify([{
            'id': user.id,
            'email': user.email,
            'nome_estabelecimento': user.nome_estabelecimento,
            'cnpj': user.cnpj,
            'plano': user.plano,
            'status': user.status,
            'created_at': user.created_at.isoformat() if user.created_at else None
        } for user in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Obter usuário específico"""
    try:
        user = User.query.get_or_404(user_id)
        return jsonify({
            'id': user.id,
            'email': user.email,
            'nome_estabelecimento': user.nome_estabelecimento,
            'cnpj': user.cnpj,
            'plano': user.plano,
            'status': user.status,
            'created_at': user.created_at.isoformat() if user.created_at else None
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Atualizar usuário"""
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if 'nome_estabelecimento' in data:
            user.nome_estabelecimento = data['nome_estabelecimento']
        if 'email' in data:
            user.email = data['email']
        if 'cnpj' in data:
            user.cnpj = data['cnpj']
        if 'telefone' in data:
            user.telefone = data['telefone']
        if 'endereco' in data:
            user.endereco = data['endereco']
        if 'plano' in data:
            user.plano = data['plano']
        if 'status' in data:
            user.status = data['status']
            
        db.session.commit()
        
        return jsonify({
            'id': user.id,
            'email': user.email,
            'nome_estabelecimento': user.nome_estabelecimento,
            'cnpj': user.cnpj,
            'plano': user.plano,
            'status': user.status
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Deletar usuário"""
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Usuário deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Obter perfil do usuário logado"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(current_user_id)
        return jsonify({
            'id': user.id,
            'email': user.email,
            'nome_estabelecimento': user.nome_estabelecimento,
            'cnpj': user.cnpj,
            'plano': user.plano,
            'status': user.status
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500