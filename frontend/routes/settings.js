const express = require('express');
const router = express.Router();

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

// Página principal de configurações
router.get('/', requireAuth, (req, res) => {
    try {
        res.render('settings/index', {
            title: 'Configurações',
            user: req.session.user,
            currentPage: 'settings'
        });
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        res.status(500).render('error', {
            title: 'Erro',
            error: 'Erro interno do servidor',
            user: req.session.user
        });
    }
});

// API para atualizar perfil
router.post('/api/profile', requireAuth, (req, res) => {
    try {
        const { name, email, phone, company } = req.body;
        
        // Aqui você faria a atualização no banco de dados
        // Por enquanto, vamos apenas simular a atualização
        
        // Atualizar sessão do usuário
        req.session.user = {
            ...req.session.user,
            name: name || req.session.user.name,
            email: email || req.session.user.email,
            phone: phone || req.session.user.phone,
            company: company || req.session.user.company
        };
        
        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar perfil'
        });
    }
});

// API para alterar senha
router.post('/api/change-password', requireAuth, (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Aqui você faria a verificação da senha atual e atualização
        // Por enquanto, vamos apenas simular
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
        }
        
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'A nova senha deve ter pelo menos 8 caracteres'
            });
        }
        
        res.json({
            success: true,
            message: 'Senha alterada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao alterar senha'
        });
    }
});

// API para atualizar configurações de notificação
router.post('/api/notifications', requireAuth, (req, res) => {
    try {
        const { 
            expiryAlerts, 
            emailReports, 
            pushNotifications, 
            notificationDays 
        } = req.body;
        
        // Aqui você salvaria as configurações no banco de dados
        // Por enquanto, vamos apenas simular
        
        res.json({
            success: true,
            message: 'Configurações de notificação salvas com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao salvar configurações de notificação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao salvar configurações'
        });
    }
});

// API para atualizar configurações do sistema
router.post('/api/system', requireAuth, (req, res) => {
    try {
        const { theme, language, autoBackup } = req.body;
        
        // Aqui você salvaria as configurações no banco de dados
        // Por enquanto, vamos apenas simular
        
        res.json({
            success: true,
            message: 'Configurações do sistema salvas com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao salvar configurações do sistema:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao salvar configurações'
        });
    }
});

// API para upload de avatar
router.post('/api/avatar', requireAuth, (req, res) => {
    try {
        // Aqui você implementaria o upload de arquivo
        // Por enquanto, vamos apenas simular
        
        res.json({
            success: true,
            message: 'Avatar atualizado com sucesso!',
            avatarUrl: '/images/avatars/default.jpg'
        });
    } catch (error) {
        console.error('Erro ao fazer upload do avatar:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer upload do avatar'
        });
    }
});

// API para exportar dados
router.get('/api/export', requireAuth, (req, res) => {
    try {
        // Aqui você implementaria a exportação de dados
        // Por enquanto, vamos apenas simular
        
        const exportData = {
            user: req.session.user,
            exportDate: new Date().toISOString(),
            products: [], // Dados dos produtos
            settings: {} // Configurações do usuário
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=validade-inteligente-export.json');
        res.json(exportData);
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao exportar dados'
        });
    }
});

// API para importar dados
router.post('/api/import', requireAuth, (req, res) => {
    try {
        // Aqui você implementaria a importação de dados
        // Por enquanto, vamos apenas simular
        
        res.json({
            success: true,
            message: 'Dados importados com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao importar dados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao importar dados'
        });
    }
});

// API para limpar cache
router.post('/api/clear-cache', requireAuth, (req, res) => {
    try {
        // Aqui você implementaria a limpeza de cache
        // Por enquanto, vamos apenas simular
        
        res.json({
            success: true,
            message: 'Cache limpo com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao limpar cache:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao limpar cache'
        });
    }
});

// API para excluir conta
router.delete('/api/delete-account', requireAuth, (req, res) => {
    try {
        // Aqui você implementaria a exclusão da conta
        // Por enquanto, vamos apenas simular
        
        res.json({
            success: true,
            message: 'Solicitação de exclusão de conta enviada!'
        });
    } catch (error) {
        console.error('Erro ao processar exclusão de conta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao processar exclusão de conta'
        });
    }
});

module.exports = router;