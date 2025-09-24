#!/usr/bin/env python3
"""
Script para testar JWT fora do contexto da aplicação
"""
import jwt
from datetime import datetime, timedelta

# Usar a mesma chave do docker-compose
JWT_SECRET = "dev-jwt-secret-change-in-production"

def test_jwt_creation_and_validation():
    print("=== Teste de JWT ===")
    
    # Criar payload
    payload = {
        'sub': 2,  # user_id
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=30),
        'jti': 'test-jti-123'
    }
    
    print(f"Payload: {payload}")
    
    # Criar token
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    print(f"Token criado: {token[:50]}...")
    
    # Validar token
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        print(f"Token válido! Decoded: {decoded}")
        return True
    except jwt.ExpiredSignatureError:
        print("Token expirado!")
        return False
    except jwt.InvalidTokenError as e:
        print(f"Token inválido: {e}")
        return False

if __name__ == "__main__":
    test_jwt_creation_and_validation()