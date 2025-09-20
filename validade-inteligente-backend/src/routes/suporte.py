from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from src.models.user import db, Usuario
from src.models.suporte import (
    Chamado, MensagemChamado, AnexoChamado, AnexoMensagem, 
    HistoricoChamado, ConfiguracaoSuporte,
    StatusChamado, PrioridadeChamado, CategoriaChamado
)
from src.models.auditoria import LogAuditoria
from src.services.email_service import email_service
from src.utils.decorators import empresa_access_required, admin_required, suporte_required
from werkzeug.utils import secure_filename
import os
import uuid
from typing import Dict, Any

suporte_bp = Blueprint('suporte', __name__)

# Configurações de upload
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', '..', 'uploads', 'suporte')
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    """Verifica se arquivo é permitido"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, subfolder='chamados'):
    """Salva arquivo enviado"""
    if not file or not allowed_file(file.filename):
        return None
    
    # Criar diretório se não existir
    upload_path = os.path.join(UPLOAD_FOLDER, subfolder)
    os.makedirs(upload_path, exist_ok=True)
    
    # Gerar nome único
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(upload_path, unique_filename)
    
    # Salvar arquivo
    file.save(file_path)
    
    return {
        'filename': unique_filename,
        'original_name': filename,
        'path': file_path,
        'size': os.path.getsize(file_path),
        'mime_type': file.content_type
    }

@suporte_bp.route('/suporte/chamados', methods=['GET'])
@jwt_required()
@empresa_access_required
def list_chamados():
    """Lista chamados da empresa"""
    try:
        empresa_id = request.empresa_id
        user_id = request.user_id
        user = Usuario.query.get(user_id)
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status = request.args.get('status')
        categoria = request.args.get('categoria')
        prioridade = request.args.get('prioridade')
        
        # Filtros baseados no perfil do usuário
        query = Chamado.query.filter_by(empresa_id=empresa_id)
        
        # Se não for admin/suporte, mostrar apenas chamados próprios
        if user.perfil not in ['admin', 'suporte']:
            query = query.filter_by(usuario_id=user_id)
        
        # Aplicar filtros
        if status:
            try:
                status_enum = StatusChamado(status)
                query = query.filter(Chamado.status == status_enum)
            except ValueError:
                pass
        
        if categoria:
            try:
                categoria_enum = CategoriaChamado(categoria)
                query = query.filter(Chamado.categoria == categoria_enum)
            except ValueError:
                pass
        
        if prioridade:
            try:
                prioridade_enum = PrioridadeChamado(prioridade)
                query = query.filter(Chamado.prioridade == prioridade_enum)
            except ValueError:
                pass
        
        # Ordenar por data de criação (mais recentes primeiro)
        chamados = query.order_by(Chamado.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        chamados_data = []
        for chamado in chamados.items:
            chamado_data = chamado.to_dict_with_relations()
            chamados_data.append(chamado_data)
        
        return jsonify({
            'chamados': chamados_data,
            'total': chamados.total,
            'pages': chamados.pages,
            'current_page': page,
            'per_page': per_page
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@suporte_bp.route('/suporte/chamados', methods=['POST'])
@jwt_required()
@empresa_access_required
def create_chamado():
    """Cria novo chamado"""
    try:
        empresa_id = request.empresa_id
        user_id = request.user_id
        
        # Verificar se permite anexos
        permite_anexos = ConfiguracaoSuporte.get_config('permitir_anexos', True)
        
        # Processar dados do formulário
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Formulário com arquivos
            titulo = request.form.get('titulo')
            descricao = request.form.get('descricao')
            categoria = request.form.get('categoria', 'duvida')
            prioridade = request.form.get('prioridade', 'normal')
            
            # Processar anexos
            anexos_data = []
            if permite_anexos and 'anexos' in request.files:
                files = request.files.getlist('anexos')
                for file in files:
                    if file and file.filename:
                        anexo_info = save_uploaded_file(file)
                        if anexo_info:
                            anexos_data.append(anexo_info)
        else:
            # JSON
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Dados não fornecidos'}), 400
            
            titulo = data.get('titulo')
            descricao = data.get('descricao')
            categoria = data.get('categoria', 'duvida')
            prioridade = data.get('prioridade', 'normal')
            anexos_data = []
        
        # Validar dados obrigatórios
        if not titulo or not descricao:
            return jsonify({'error': 'Título e descrição são obrigatórios'}), 400
        
        # Validar enums
        try:
            categoria_enum = CategoriaChamado(categoria)
            prioridade_enum = PrioridadeChamado(prioridade)
        except ValueError:
            return jsonify({'error': 'Categoria ou prioridade inválida'}), 400
        
        # Criar chamado
        chamado = Chamado(
            numero=Chamado.generate_numero(),
            empresa_id=empresa_id,
            usuario_id=user_id,
            titulo=titulo,
            descricao=descricao,
            categoria=categoria_enum,
            prioridade=prioridade_enum,
            ip_origem=request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr),
            user_agent=request.headers.get('User-Agent')
        )
        
        # Configurar SLA
        chamado.sla_resposta_horas = ConfiguracaoSuporte.get_config('sla_resposta_horas_padrao', 1)
        chamado.sla_resolucao_horas = ConfiguracaoSuporte.get_config('sla_resolucao_horas_padrao', 24)
        chamado.calcular_sla()
        
        db.session.add(chamado)
        db.session.flush()  # Para obter o ID
        
        # Adicionar anexos
        for anexo_info in anexos_data:
            anexo = AnexoChamado(
                chamado_id=chamado.id,
                usuario_id=user_id,
                nome_arquivo=anexo_info['filename'],
                nome_original=anexo_info['original_name'],
                tipo_mime=anexo_info['mime_type'],
                tamanho=anexo_info['size'],
                caminho=anexo_info['path']
            )
            db.session.add(anexo)
        
        # Registrar no histórico
        HistoricoChamado.registrar_alteracao(
            chamado_id=chamado.id,
            usuario_id=user_id,
            acao='criado',
            observacao=f'Chamado criado com categoria {categoria} e prioridade {prioridade}'
        )
        
        # Log de auditoria
        LogAuditoria.log_action(
            acao='chamado_criado',
            empresa_id=empresa_id,
            usuario_id=user_id,
            tabela_afetada='chamados',
            registro_id=chamado.id,
            dados_novos={
                'numero': chamado.numero,
                'titulo': titulo,
                'categoria': categoria,
                'prioridade': prioridade
            },
            categoria='suporte'
        )
        
        db.session.commit()
        
        # Enviar e-mail de notificação
        try:
            chamado_data = chamado.to_dict_with_relations()
            email_service.send_support_ticket_created(chamado_data)
        except Exception as e:
            print(f"Erro ao enviar e-mail de chamado criado: {str(e)}")
        
        return jsonify({
            'success': True,
            'chamado': chamado.to_dict_with_relations(),
            'message': f'Chamado {chamado.numero} criado com sucesso'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@suporte_bp.route('/suporte/chamados/<int:chamado_id>', methods=['GET'])
@jwt_required()
@empresa_access_required
def get_chamado(chamado_id):
    """Obtém detalhes de um chamado"""
    try:
        empresa_id = request.empresa_id
        user_id = request.user_id
        user = Usuario.query.get(user_id)
        
        # Buscar chamado
        query = Chamado.query.filter_by(id=chamado_id, empresa_id=empresa_id)
        
        # Se não for admin/suporte, verificar se é o dono do chamado
        if user.perfil not in ['admin', 'suporte']:
            query = query.filter_by(usuario_id=user_id)
        
        chamado = query.first_or_404()
        
        # Buscar mensagens
        mensagens = MensagemChamado.query.filter_by(chamado_id=chamado_id)
        
        # Filtrar mensagens visíveis para o cliente
        if user.perfil not in ['admin', 'suporte']:
            mensagens = mensagens.filter_by(visivel_cliente=True)
        
        mensagens = mensagens.order_by(MensagemChamado.created_at.asc()).all()
        
        # Buscar histórico (apenas para admin/suporte)
        historico = []
        if user.perfil in ['admin', 'suporte']:
            historico_query = HistoricoChamado.query.filter_by(
                chamado_id=chamado_id
            ).order_by(HistoricoChamado.created_at.asc()).all()
            
            historico = [h.to_dict() for h in historico_query]
        
        return jsonify({
            'chamado': chamado.to_dict_with_relations(),
            'mensagens': [m.to_dict_with_user() for m in mensagens],
            'historico': historico
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@suporte_bp.route('/suporte/chamados/<int:chamado_id>/mensagens', methods=['POST'])
@jwt_required()
@empresa_access_required
def add_mensagem_chamado(chamado_id):
    """Adiciona mensagem ao chamado"""
    try:
        empresa_id = request.empresa_id
        user_id = request.user_id
        user = Usuario.query.get(user_id)
        
        # Buscar chamado
        query = Chamado.query.filter_by(id=chamado_id, empresa_id=empresa_id)
        
        # Se não for admin/suporte, verificar se é o dono do chamado
        if user.perfil not in ['admin', 'suporte']:
            query = query.filter_by(usuario_id=user_id)
        
        chamado = query.first_or_404()
        
        # Verificar se chamado permite novas mensagens
        if chamado.status in [StatusChamado.FECHADO, StatusChamado.CANCELADO]:
            return jsonify({'error': 'Chamado não permite novas mensagens'}), 400
        
        # Processar dados
        if request.content_type and 'multipart/form-data' in request.content_type:
            conteudo = request.form.get('conteudo')
            tipo = request.form.get('tipo', 'resposta')
            visivel_cliente = request.form.get('visivel_cliente', 'true').lower() == 'true'
            
            # Processar anexos
            anexos_data = []
            if 'anexos' in request.files:
                files = request.files.getlist('anexos')
                for file in files:
                    if file and file.filename:
                        anexo_info = save_uploaded_file(file, 'mensagens')
                        if anexo_info:
                            anexos_data.append(anexo_info)
        else:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Dados não fornecidos'}), 400
            
            conteudo = data.get('conteudo')
            tipo = data.get('tipo', 'resposta')
            visivel_cliente = data.get('visivel_cliente', True)
            anexos_data = []
        
        if not conteudo:
            return jsonify({'error': 'Conteúdo da mensagem é obrigatório'}), 400
        
        # Validar tipo de mensagem
        if user.perfil not in ['admin', 'suporte'] and tipo != 'resposta':
            tipo = 'resposta'
        
        # Criar mensagem
        mensagem = MensagemChamado(
            chamado_id=chamado_id,
            usuario_id=user_id,
            conteudo=conteudo,
            tipo=tipo,
            visivel_cliente=visivel_cliente,
            ip_origem=request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr),
            user_agent=request.headers.get('User-Agent')
        )
        
        db.session.add(mensagem)
        db.session.flush()
        
        # Adicionar anexos
        for anexo_info in anexos_data:
            anexo = AnexoMensagem(
                mensagem_id=mensagem.id,
                usuario_id=user_id,
                nome_arquivo=anexo_info['filename'],
                nome_original=anexo_info['original_name'],
                tipo_mime=anexo_info['mime_type'],
                tamanho=anexo_info['size'],
                caminho=anexo_info['path']
            )
            db.session.add(anexo)
        
        # Marcar primeira resposta se for da equipe de suporte
        if user.perfil in ['admin', 'suporte'] and not chamado.primeira_resposta_em:
            chamado.marcar_primeira_resposta()
            
            # Alterar status para em andamento
            if chamado.status == StatusChamado.ABERTO:
                old_status = chamado.status.value
                chamado.status = StatusChamado.EM_ANDAMENTO
                
                # Registrar mudança de status no histórico
                HistoricoChamado.registrar_alteracao(
                    chamado_id=chamado_id,
                    usuario_id=user_id,
                    acao='status_alterado',
                    campo_alterado='status',
                    valor_anterior=old_status,
                    valor_novo=chamado.status.value,
                    observacao='Status alterado automaticamente após primeira resposta'
                )
        
        # Atualizar timestamp do chamado
        chamado.updated_at = datetime.now()
        
        # Registrar no histórico
        HistoricoChamado.registrar_alteracao(
            chamado_id=chamado_id,
            usuario_id=user_id,
            acao='mensagem_adicionada',
            observacao=f'Mensagem do tipo {tipo} adicionada'
        )
        
        # Log de auditoria
        LogAuditoria.log_action(
            acao='mensagem_chamado_adicionada',
            empresa_id=empresa_id,
            usuario_id=user_id,
            tabela_afetada='mensagens_chamados',
            registro_id=mensagem.id,
            dados_novos={
                'chamado_id': chamado_id,
                'tipo': tipo,
                'visivel_cliente': visivel_cliente
            },
            categoria='suporte'
        )
        
        db.session.commit()
        
        # Enviar e-mail de notificação
        try:
            chamado_data = chamado.to_dict_with_relations()
            mensagem_data = mensagem.to_dict_with_user()
            email_service.send_support_ticket_response(chamado_data, mensagem_data)
        except Exception as e:
            print(f"Erro ao enviar e-mail de resposta: {str(e)}")
        
        return jsonify({
            'success': True,
            'mensagem': mensagem.to_dict_with_user(),
            'message': 'Mensagem adicionada com sucesso'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@suporte_bp.route('/suporte/chamados/<int:chamado_id>/status', methods=['PUT'])
@jwt_required()
@suporte_required
def update_chamado_status(chamado_id):
    """Atualiza status do chamado (apenas suporte/admin)"""
    try:
        empresa_id = request.empresa_id
        user_id = request.user_id
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        new_status = data.get('status')
        observacao = data.get('observacao', '')
        
        if not new_status:
            return jsonify({'error': 'Status é obrigatório'}), 400
        
        # Validar status
        try:
            status_enum = StatusChamado(new_status)
        except ValueError:
            return jsonify({'error': 'Status inválido'}), 400
        
        # Buscar chamado
        chamado = Chamado.query.filter_by(
            id=chamado_id, empresa_id=empresa_id
        ).first_or_404()
        
        old_status = chamado.status.value
        
        # Atualizar status
        chamado.status = status_enum
        chamado.updated_at = datetime.now()
        
        # Definir atendente se não estiver definido
        if not chamado.atendente_id:
            chamado.atendente_id = user_id
        
        # Marcar como resolvido se necessário
        if status_enum == StatusChamado.RESOLVIDO and not chamado.resolvido_em:
            chamado.resolver(user_id)
        
        # Marcar como fechado se necessário
        if status_enum == StatusChamado.FECHADO and not chamado.fechado_em:
            chamado.fechar()
        
        # Registrar no histórico
        HistoricoChamado.registrar_alteracao(
            chamado_id=chamado_id,
            usuario_id=user_id,
            acao='status_alterado',
            campo_alterado='status',
            valor_anterior=old_status,
            valor_novo=new_status,
            observacao=observacao
        )
        
        # Log de auditoria
        LogAuditoria.log_action(
            acao='chamado_status_alterado',
            empresa_id=empresa_id,
            usuario_id=user_id,
            tabela_afetada='chamados',
            registro_id=chamado_id,
            dados_anteriores={'status': old_status},
            dados_novos={'status': new_status, 'observacao': observacao},
            categoria='suporte'
        )
        
        db.session.commit()
        
        # Enviar e-mail de notificação
        try:
            chamado_data = chamado.to_dict_with_relations()
            email_service.send_support_ticket_status_change(chamado_data, old_status, new_status)
        except Exception as e:
            print(f"Erro ao enviar e-mail de status: {str(e)}")
        
        return jsonify({
            'success': True,
            'chamado': chamado.to_dict_with_relations(),
            'message': f'Status alterado de {old_status} para {new_status}'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@suporte_bp.route('/suporte/chamados/<int:chamado_id>/avaliar', methods=['POST'])
@jwt_required()
@empresa_access_required
def avaliar_chamado(chamado_id):
    """Avalia chamado resolvido"""
    try:
        empresa_id = request.empresa_id
        user_id = request.user_id
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        nota = data.get('nota')
        comentario = data.get('comentario', '')
        
        if not nota or not (1 <= nota <= 5):
            return jsonify({'error': 'Nota deve ser entre 1 e 5'}), 400
        
        # Buscar chamado (apenas o dono pode avaliar)
        chamado = Chamado.query.filter_by(
            id=chamado_id, empresa_id=empresa_id, usuario_id=user_id
        ).first_or_404()
        
        # Verificar se chamado está resolvido
        if chamado.status != StatusChamado.RESOLVIDO:
            return jsonify({'error': 'Apenas chamados resolvidos podem ser avaliados'}), 400
        
        # Verificar se já foi avaliado
        if chamado.avaliacao_nota:
            return jsonify({'error': 'Chamado já foi avaliado'}), 400
        
        # Avaliar chamado
        chamado.avaliar(nota, comentario)
        
        # Fechar chamado automaticamente após avaliação
        chamado.fechar()
        
        # Registrar no histórico
        HistoricoChamado.registrar_alteracao(
            chamado_id=chamado_id,
            usuario_id=user_id,
            acao='avaliado',
            observacao=f'Chamado avaliado com nota {nota}'
        )
        
        # Log de auditoria
        LogAuditoria.log_action(
            acao='chamado_avaliado',
            empresa_id=empresa_id,
            usuario_id=user_id,
            tabela_afetada='chamados',
            registro_id=chamado_id,
            dados_novos={
                'nota': nota,
                'comentario': comentario
            },
            categoria='suporte'
        )
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'chamado': chamado.to_dict_with_relations(),
            'message': 'Avaliação registrada com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@suporte_bp.route('/suporte/dashboard', methods=['GET'])
@jwt_required()
@suporte_required
def dashboard_suporte():
    """Dashboard para equipe de suporte"""
    try:
        # Estatísticas gerais
        total_chamados = Chamado.query.count()
        chamados_abertos = Chamado.query.filter(
            Chamado.status.in_([StatusChamado.ABERTO, StatusChamado.EM_ANDAMENTO])
        ).count()
        
        chamados_vencidos = Chamado.query.filter(
            Chamado.data_limite_resposta < datetime.now(),
            Chamado.primeira_resposta_em.is_(None)
        ).count()
        
        # Chamados por status
        status_counts = {}
        for status in StatusChamado:
            count = Chamado.query.filter_by(status=status).count()
            status_counts[status.value] = count
        
        # Chamados por prioridade
        prioridade_counts = {}
        for prioridade in PrioridadeChamado:
            count = Chamado.query.filter_by(prioridade=prioridade).count()
            prioridade_counts[prioridade.value] = count
        
        # SLA médio de resposta (últimos 30 dias)
        data_limite = datetime.now() - timedelta(days=30)
        chamados_respondidos = Chamado.query.filter(
            Chamado.primeira_resposta_em.isnot(None),
            Chamado.created_at >= data_limite
        ).all()
        
        tempo_resposta_medio = 0
        if chamados_respondidos:
            tempos = [c.get_tempo_primeira_resposta() for c in chamados_respondidos if c.get_tempo_primeira_resposta()]
            if tempos:
                tempo_resposta_medio = sum(tempos) / len(tempos)
        
        # Avaliação média
        chamados_avaliados = Chamado.query.filter(
            Chamado.avaliacao_nota.isnot(None)
        ).all()
        
        avaliacao_media = 0
        if chamados_avaliados:
            notas = [c.avaliacao_nota for c in chamados_avaliados]
            avaliacao_media = sum(notas) / len(notas)
        
        return jsonify({
            'estatisticas': {
                'total_chamados': total_chamados,
                'chamados_abertos': chamados_abertos,
                'chamados_vencidos': chamados_vencidos,
                'tempo_resposta_medio_minutos': round(tempo_resposta_medio, 2),
                'avaliacao_media': round(avaliacao_media, 2)
            },
            'status_counts': status_counts,
            'prioridade_counts': prioridade_counts
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@suporte_bp.route('/suporte/configuracoes', methods=['GET'])
@jwt_required()
@admin_required
def get_configuracoes_suporte():
    """Obtém configurações do suporte"""
    try:
        configs = ConfiguracaoSuporte.query.all()
        
        return jsonify({
            'configuracoes': [config.to_dict() for config in configs]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@suporte_bp.route('/suporte/configuracoes', methods=['PUT'])
@jwt_required()
@admin_required
def update_configuracoes_suporte():
    """Atualiza configurações do suporte"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        updated_configs = []
        
        for chave, valor in data.items():
            config = ConfiguracaoSuporte.set_config(chave, valor)
            updated_configs.append(config.to_dict())
        
        # Log de auditoria
        LogAuditoria.log_action(
            acao='configuracoes_suporte_atualizadas',
            usuario_id=user_id,
            dados_novos=data,
            categoria='system'
        )
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'configuracoes': updated_configs,
            'message': 'Configurações atualizadas com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

