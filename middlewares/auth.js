const jwt = require('jsonwebtoken')
const { users } = require('../data/database')

//Função que verifica o token pelo caeçalho da URL
const verifyToken = (req, res, next) => {
    //Recebe o autenticador pelo cabeçalho usando a chave 'authorization'
    const authHeader = req.headers['authorization']

    //Realiza a separação da string do authHeader
    const token = authHeader && authHeader.split(' ')[1]

    //Se o token for vazio, chamará erro 401 de acesso negado
    if(!token){
        return res.status(401).json({message: 'Acesso negado'})
    }

    //Verifica o token utilizando a chave do arquivo env
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            //Se o token não exisir ou não for valido, acionará o erro 403, caso contrário aprovará e irá para a próxima função
            return res.status(403).json({ message: 'Token inválido!' });
        }

        req.user = user;
        next();
    })
}


//Função para verificar se no token contém a informação se o usuário é administrador ou não
const isAdm = (req, res, next) => {
    verifyToken(req, res, (err) => {
        //Se der erro na leitura, acionará erro 401
        if(err) {
            return res.status(401).json({message: 'Acesso negado'})
        }

        //Se o usuário não tiver informação isAdm ou ele for false, dará erro 403
        if(!req.user.isAdm) {
            return res.status(403).json({message: 'Acesso negado: apenas administradores podem realizar a ação'})
        }


        //Caso ele seja, irá para a próxima função
        next();
    })
}

//Função que identifica se a permissão do usuário é ele mesmo ou se é um administrador
const userIsAdmOrHimself = (req, res, next) => {
    verifyToken(req, res, (err) => {

        //Resgate das informações do body
        const idUserToBeUpdated = req.body.id
        const idUserMakingUpdate = req.user.id
        const isAdm = req.user.isAdm

        if(err) {
            return res.status(401).json({message: 'Acesso negado'})
        }

        //Se o usuário não for administrador ou nem a mesma pessoa a sofrer as alterações, acionará erro 403
        if(!isAdm && (idUserToBeUpdated !== idUserMakingUpdate)) {
            return res.status(403).json({message: 'Acesso negado: apenas administradores podem realizar a ação'})
        }

        //Caso contrário, proseguirá para a próxima função
        next();
    })
}

//Função para caso não encontre a rota especificada
const urlNotValid = (req, res, next) => {
    res.status(404).json({message: "Rota não existente"})
}



module.exports = { verifyToken, isAdm, userIsAdmOrHimself, urlNotValid }
