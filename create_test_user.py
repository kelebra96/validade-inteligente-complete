from src.models.main import db, app
from src.models.user import User

with app.app_context():
    # Verificar se usuário já existe
    existing_user = User.query.filter_by(email='admin@admin.com').first()
    if existing_user:
        print(f'Usuário admin@admin.com já existe com ID: {existing_user.id}')
        # Atualizar senha
        existing_user.set_password('admin123')
        db.session.commit()
        print('Senha atualizada para admin123')
    else:
        # Criar novo usuário
        user = User(
            email='admin@admin.com',
            nome_estabelecimento='Admin Test',
            status='ativo'
        )
        user.set_password('admin123')
        db.session.add(user)
        db.session.commit()
        print(f'Usuário criado com ID: {user.id}')