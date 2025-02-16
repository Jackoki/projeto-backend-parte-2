const { Op } = require('sequelize');
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Ticket = require('../models/Ticket')
const TicketStock = require('../models/TicketStock')

//Função que retorna todos os usuários salvos no vetor users do database
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } 
    
    catch (error) {
        res.status(500).json({ erro: "Erro ao consultar os usuários!" });
    }
};

//Função na tela inicial para o usuário instalar os dados padrão ao clicar no botão
const installSystem = async (req, res) => {
    try {
        const existingAdmin = await User.findOne({
            where: { isAdm: true, email: "adm@gmail.com" }
        });

        if (existingAdmin) {
            return res.render('error', { erro: "O sistema já tem o usuário Administrator!", route: '/' });
        }

        const initialAdm = await User.create({
            name: "Administrator",
            email: "adm@gmail.com",
            username: "admin",
            password: "admin",
            isAdm: true
        });

        const tickets = [
            { id: 1, name: 'Meia', price: 30.00 },
            { id: 2, name: 'Inteira', price: 60.00 },
            { id: 3, name: 'V.I.P', price: 90.00 }
        ];

        const createdTickets = await Ticket.bulkCreate(tickets, { ignoreDuplicates: true });

        const ticketStockData = [
            { ticketId: 1, quantity: 20 },
            { ticketId: 2, quantity: 20 },
            { ticketId: 3, quantity: 10 }
        ];

        await TicketStock.bulkCreate(ticketStockData);

        res.render('success', { message: "Sistema instalado com sucesso!", route: "/" });
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao instalar o sistema!", route: '/' });
    }
};

//Função para criar usuário
const createUser = async (req, res) => {
    const { name, email, username, password, isAdm } = req.body;

    if (!name || !email || !username || !password) {
        res.render('error', { erro: "Valores não preenchidos!", route: '/register' });
    }

    try {
        //Realiza a verificação se existe um usuário existente ou não no banco de dados
        //Nesse caso ele utiliza a operação OR no banco de dados para ver se email ou username já existem
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            res.render('error', { erro: "Email ou usuário já existentes!", route: '/register' });
        }

        const userCreated = await User.create({
            name,
            email,
            username,
            password,
            isAdm
        });

        res.render('home', { titulo: "Bem-vindo!" });
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao realizar o registro!", route: '/' });
    }
};


//Função de login que retorna um token
const verifyUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userLogin = await User.findOne({
            where: { username, password }
        });

        if (!userLogin) {
            return res.render('error', { erro: "Informações vazias!", route: '/users/login' });
        }

        const token = jwt.sign({ id: userLogin.id, isAdm: userLogin.isAdm }, process.env.JWT_SECRET, { expiresIn: '1 hr' });
        res.cookie("token", token, { httpOnly: true });

        res.render('mainPageUser');
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao fazer login!", route: '/users/login' });
    }
};

//Função de atualizar informações do usuário
const updateUser = async (req, res) => {
    const { id, name, email, username, password } = req.body;

    try {
        const userToBeUpdated = await User.findOne({ where: { id } });

        if (!userToBeUpdated) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await userToBeUpdated.update({ name, email, username, password });

        res.status(200).json(userToBeUpdated);
    } 
    
    catch (error) {
        res.status(500).json({ erro: "Erro ao atualizar o usuário!" });
    }
};

const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const userToDelete = await User.findOne({ where: { id: userId } });

        if (!userToDelete) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (userToDelete.isAdm) {
            return res.status(400).json({ message: 'Admins não podem ser deletados' });
        }

        await userToDelete.destroy();

        res.status(200).json({ message: 'Usuário deletado', user: userToDelete });
    } 
    
    catch (error) {
        res.status(500).json({ erro: "Erro ao deletar o usuário!" });
    }
};

module.exports = {
    getUsers,
    installSystem,
    createUser,
    verifyUser,
    updateUser,
    deleteUser
}
