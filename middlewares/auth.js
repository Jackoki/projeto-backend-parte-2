const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Função que verifica o token pelo cabeçalho da URL
const verifyToken = (req, res, next) => {
    // Recebe o token pelo cookie
    const token = req.cookies.token;

    // Se o token for vazio, chamará erro 401 de acesso negado
    if (!token) {
        return res.render('error', { erro: "Acesso negado!" });
    }

    // Verifica o token utilizando a chave do arquivo env
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            // Se o token não existir ou não for válido, acionará o erro 403
            return res.render('error', { erro: "Token inválido, logue novamente!" });
        }

        try {
            // Busca o usuário no banco de dados pelo ID contido no token
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.render('error', { erro: "Usuário não encontrado!" });
            }

            // Adiciona o usuário ao objeto req para uso posterior
            req.user = user;
            next(); // Chama o próximo middleware ou função de rota
        } 
        
        catch (error) {
            console.log(error)
            res.render('error', { erro: "Erro ao buscar usuário no banco de dados!" });
        }
    });
};


//Função para verificar se no token contém a informação se o usuário é administrador ou não
const isAdm = (req, res, next) => {
    // Verifica se o usuário é administrador
    if (!req.user.isAdm) {
        return res.render('error', { erro: "Acesso negado: apenas administradores podem realizar a ação!" });
    }

    // Se o usuário for administrador, segue para a próxima função
    next();
};


//Função para caso não encontre a rota especificada
const urlNotValid = (req, res, next) => {
    res.status(404).render('routeNotFounded');
}



module.exports = { verifyToken, isAdm, urlNotValid }
