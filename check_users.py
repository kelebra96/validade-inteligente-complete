from src.models.main import db, app
from src.models.user import User

with app.app_context():
    users = User.query.all()
    print(f'Usuários encontrados: {len(users)}')
    for u in users:
        print(f'ID: {u.id}, Email: {u.email}, Status: {u.status}')