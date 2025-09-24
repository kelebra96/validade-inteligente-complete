from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from src.models.user import User, db
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validar formato do email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    """Registrar novo usuário"""
    try:
        data = request.get_json()
        
        # Validações
        if not data.get('email') or not data.get('password') or not data.get('nome_estabelecimento'):
            return jsonify({'error': 'Email, senha e nome do estabelecimento são obrigatórios'}), 400
            
        if not validate_email(data['email']):
            return jsonify({'error': 'Email inválido'}), 400
            
        if len(data['password']) < 6:
            return jsonify({'error': 'Senha deve ter pelo menos 6 caracteres'}), 400
        
        # Verificar se usuário já existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email já cadastrado'}), 409
        
        # Criar novo usuário
        user = User(
            email=data['email'],
            nome_estabelecimento=data['nome_estabelecimento'],
            cnpj=data.get('cnpj'),
            telefone=data.get('telefone'),
            endereco=data.get('endereco'),
            plano=data.get('plano', 'basico'),
            status='ativo'
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Criar token de acesso
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'success': True,
            'message': 'Usuário criado com sucesso',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'nome_estabelecimento': user.nome_estabelecimento,
                'plano': user.plano,
                'status': user.status
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login do usuário"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Credenciais inválidas'}), 401
            
        if user.status != 'ativo':
            return jsonify({'error': 'Usuário inativo'}), 401
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'nome_estabelecimento': user.nome_estabelecimento,
                'plano': user.plano,
                'status': user.status
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Obter dados do usuário atual"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(current_user_id)
        
        return jsonify({
            'id': user.id,
            'email': user.email,
            'nome_estabelecimento': user.nome_estabelecimento,
            'plano': user.plano,
            'status': user.status
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Alterar senha do usuário"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(current_user_id)
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Senha atual e nova senha são obrigatórias'}), 400
            
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Senha atual incorreta'}), 401
            
        if len(data['new_password']) < 6:
            return jsonify({'error': 'Nova senha deve ter pelo menos 6 caracteres'}), 400
        
        user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({'message': 'Senha alterada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500