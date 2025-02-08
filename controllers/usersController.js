const { users, getNewId } = require('../data/database')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

//Função que retorna todos os usuários salvos no vetor users do database
const getUsers = (req, res) => {
    res.status(200).json(users)
}


//Função que retorna as informações do usuário pelo ID passado no req.params
const getUserById = (req, res) => {
    const userId = parseInt(req.params.id)
    
    const user = users.find(u => u.id === userId)

    //Caso não encontre o ID, retornará status 404
    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json(user);
}

const createInitialAdm = (req, res) => {
    // Verifica se já existe um usuário administrador
    const existingAdmin = users.find(user => user.isAdm === true && user.name === "Administrator");

    // Se o administrador já foi criado, retorna uma mensagem de erro
    if (existingAdmin) {
        return res.status(400).json({ message: 'Já existe o usuário Administrator no sistema.'});
    }

    const initialAdm = new User(getNewId(), "Administrator", "adm@gmail.com", "admin", "admin", true)
        
    //Como o database é um vetor, realizamos o push do model acima
    users.push(initialAdm)
    res.status(200).json(initialAdm)
}


//Função para criar usuário
const createUser = (req, res) => {

    //Criação de variável com as informações passada pelo body
    const newUser =  req.body

    //Se o body não conter name, email, user e password, será chamado o erro 400.
    if (!newUser.name || !newUser.email || !newUser.user || !newUser.password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    else{
        //Ao criar o usuário, chamamos o model User e então atribuimos os valores de ID e isAdm de forma padronizada, já que é um usuário
        const userCreated = new User(getNewId(), newUser.name, newUser.email, newUser.user, newUser.password, false)

        //Como o database é um vetor, realizamos o push do model acima
        users.push(userCreated)
        res.status(200).json(userCreated)
    }
}


//Função para criar administrador
const createUserAdm = (req, res) => {
    
    //Criação de variável com as informações passada pelo body
    const newUser =  req.body

    //Se o body não conter name, email, user e password, será chamado o erro 400.
    if (!newUser.name || !newUser.email || !newUser.user || !newUser.password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    else{
        //Ao criar o usuário, chamamos o model User e então atribuimos os valores de ID e isAdm de forma padronizada, já que é um administrador
        const userCreated = new User(getNewId(), newUser.name, newUser.email, newUser.user, newUser.password, true)

        
        //Como o database é um vetor, realizamos o push do model acima
        users.push(userCreated)
        res.status(200).json(userCreated)
    }
}

//Função de login que retorna um token
const verifyUser = (req, res) => {
    //As informações de autenticação são passada pelo body
    const {user, password} = req.body

    //Será procurado o usuário com o mesmo nome e senha no vetor
    const userLogin = users.find(u => u.user === user && u.password === password)

    //Caso não encontre, retornará erro 401
    if(!userLogin) {
        return res.status(401).json({ message: 'Usuário ou senha inválida, tente novamente' });
    }

    else{
        //Será gerado um jwt token que contém 2 informações, o ID do usuário e se ele é ADM
        //Criptografia feita com a string atribuida do JWT_SECRET do arquivo .env
        //O token terá validade de até 1 hora
        const token = jwt.sign({id: userLogin.id, isAdm: userLogin.isAdm}, process.env.JWT_SECRET, {expiresIn: '1 hr'})
        res.cookie("token", token, {httpOnly: true})

        res.status(200).json({message: 'Login funcionou', token})
    }
}


//Função de atualizar informações do usuário
const updateUser = (req, res) => {
    //O ID do usuário é passado pelo body
    const userId = req.body.id

    //Procura o ID do usuário no vetor users
    //O userToBeUpdated é passado por referência, então podemos alterar suas informações de forma direta no vetor.
    const userToBeUpdated = users.find(u => u.id === userId)

    //Se não encontrar o user no vetor, retornará erro 404
    if(!userToBeUpdated) {
        return res.status(404).json({ message: 'Usuário não existente' });
    }

    //Vetor com as propriedades que serão atualizadas no user
    const properties = ['name', 'email', 'user', 'password']

    //Para cada propriedade do body que é igual dos valores do properties, realizamos a atualização da informação no userToBeUpdated
    Object.keys(req.body).forEach(key => {
        if(properties.includes(key)) {
            userToBeUpdated[key] = req.body[key]
        }
    })

    //Retorna as informações atualizadas do usuário
    res.status(200).json(userToBeUpdated)
}



//Função de atualizar informações do admninistrador
const updateUserAdm = (req, res) => {
    //O ID do usuário é passado pelo body
    const userId = req.body.id

    
    //Procura o ID do usuário no vetor users
    //O userToBeUpdated é passado por referência, então podemos alterar suas informações de forma direta no vetor.
    const userToBeUpdated = users.find(u => u.id === userId)

    
    //Se não encontrar o user no vetor, retornará erro 404
    if(!userToBeUpdated) {
        return res.status(404).json({ message: 'Usuário não existente' });
    }

    
    //Vetor com as propriedades que serão atualizadas no user
    const properties = ['name', 'email', 'user', 'password']

    
    //Para cada propriedade do body que é igual dos valores do properties, realizamos a atualização da informação no userToBeUpdated
    Object.keys(req.body).forEach(key => {
        if(properties.includes(key)) {
            userToBeUpdated[key] = req.body[key]
        }
    })

    
    //Retorna as informações atualizadas do usuário
    res.status(200).json(userToBeUpdated)
}

//Função para deletar o usuário
const deleteUser = (req, res) => {
    const userId = parseInt(req.params.id);

    //Procuramos o index do usuário pelo id do parametro.
    const userIndex = users.findIndex(u => u.id === userId)
    
    //Se não encontrar o usuário, retornará erro 404
    if(userIndex === -1){
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Obtemos o usuário a partir do índice encontrado.
    const userToDelete = users[userIndex];

    //Caso o usuário a ser apagado for ADM, não ocorrerá a deleção
    if(userToDelete.isAdm){
        return res.status(400).json({ message: 'Admins não podem ser deletados' });
    }
    
    //Remove o usuário do array
    const [deletedUser] = users.splice(userIndex, 1);

    //Retorna as informações do usuário deletado
    res.status(200).json(deletedUser)
}

module.exports = {
    getUsers,
    getUserById,
    createInitialAdm,
    createUser,
    createUserAdm,
    verifyUser,
    updateUser,
    updateUserAdm,
    deleteUser
}
