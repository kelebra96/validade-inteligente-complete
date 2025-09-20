import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from src.models.user import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.produtos import produtos_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configurações
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Inicializar extensões
jwt = JWTManager(app)
CORS(app, origins="*")

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(produtos_bp, url_prefix='/api')

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Importar todos os modelos para criar as tabelas
from src.models.produto import Produto, Alerta, HistoricoVenda, Gamificacao, Medalha, Meta

with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# Handler para tokens expirados
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return {'error': 'Token expirado'}, 401

# Handler para tokens inválidos
@jwt.invalid_token_loader
def invalid_token_callback(error):
    return {'error': 'Token inválido'}, 401

# Handler para tokens ausentes
@jwt.unauthorized_loader
def missing_token_callback(error):
    return {'error': 'Token de autorização necessário'}, 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
