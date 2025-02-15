const Ticket = require('../models/Ticket');
const TicketStock = require('../models/TicketStock');
const UserTicket = require('../models/UserTickets');

// Função para retornar todos os tickets com paginação
const getTickets = async (req, res) => {
    const { page = 1 } = req.query;
    const limit = parseInt(req.query.limit, 10) || 5;

    try {
        const { count, rows } = await Ticket.findAndCountAll({
            limit: limit,
            offset: (page - 1) * limit,
        });

        const lastPage = Math.ceil(count / limit);
        res.status(200).json({
            items: rows,
            currentPage: page,
            lastPage: lastPage,
            totalItems: count,
        });
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao consultar tickets!" });
    }
};

// Função que retorna informações de um ticket pelo nome
const getTicketByName = async (req, res) => {
    const ticketName = req.params.name;

    try {
        const ticket = await Ticket.findOne({
            where: { name: ticketName },
        });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket não encontrado" });
        }

        res.status(200).json(ticket);
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao consultar ticket!" });
    }
};

// Função que retorna tickets pelo preço
const getTicketsByPrice = async (req, res) => {
    const { page = 1 } = req.query;
    const limit = parseInt(req.query.limit, 10) || 5;
    const ticketPrice = parseFloat(req.params.price);

    if (isNaN(ticketPrice)) {
        return res.render('error', { erro: "Preço inválido!" });
    }

    try {
        const { count, rows } = await Ticket.findAndCountAll({
            where: { price: ticketPrice },
            limit: limit,
            offset: (page - 1) * limit,
        });

        const lastPage = Math.ceil(count / limit);

        if (rows.length === 0) {
            return res.render('error', { erro: "Nenhum ticket encontrado para o preço especificado!" });
        }

        res.status(200).json({
            items: rows,
            currentPage: page,
            lastPage: lastPage,
            totalItems: count,
        });
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao buscar tickets!" });
    }
};

const getUserTickets = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.render('error', { erro: "Usuário não encontrado!" });
    }

    try {
        const userTickets = await UserTicket.findAll({
            where: { userId },
            include: [
                {
                    model: Ticket,
                    attributes: ['id', 'name', 'price'],
                }
            ],
            attributes: ['id', 'quantity', 'purchaseDate', 'status'],
        });

        if (userTickets.length === 0) {
            return res.render('error', { erro: "Nenhum ingresso encontrado para este usuário!" });
        }

        return res.status(200).json(userTickets);
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao buscar tickets!" });
    }
};

// Função para registrar um novo ticket
const registerTicket = async (req, res) => {
    const { name, price, type, description } = req.body;

    if (!name || !type || typeof price !== 'number' || !description) {
        return res.render('error', { erro: "Todos os campos são obrigatórios ou os tipos de parâmetros estão incorretos!" });
    }

    try {
        const newTicket = await Ticket.create({
            name,
            price,
            type,
            description
        });

        res.status(200).json(newTicket);
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao criar o ticket!" });
    }
};

const buyTicket = async (req, res) => {
    const { userId, tickets } = req.body;
    
    // Validações iniciais
    if (!userId || !tickets || tickets.length === 0) {
        return res.render('error', { erro: "Usuário ou ingressos informados incorretamente!" });
    }

    const transaction = await sequelize.transaction();

    try {
        for (const ticket of tickets) {
            const { ticketId, quantity } = ticket;

            // Verifica a quantidade no estoque
            const stock = await TicketStock.findOne({
                where: { ticketId },
                transaction,
            });

            if (!stock || stock.quantity < quantity) {
                throw new Error(`Estoque insuficiente para o ingresso ID ${ticketId}.`);
            }

            // Atualiza o estoque
            stock.quantity -= quantity;
            await stock.save({ transaction });

            // Registra a compra
            await UserTicket.create({
                userId,
                ticketId,
                quantity,
                status: 'completed',
                purchaseDate: new Date(),
            }, { transaction });
        }

        // Confirma a transação
        await transaction.commit();
        return res.status(200).json({ message: 'Ingressos comprados com sucesso!' });

    } 
    
    catch (error) {
        // Reverte a transação em caso de erro
        await transaction.rollback();
        res.render('error', { erro: "Erro ao realizar a compra!" });
    }
};

// Função para atualizar informações de um ticket
const updateTicket = async (req, res) => {
    const ticketId = parseInt(req.params.id);

    try {
        const ticket = await Ticket.findByPk(ticketId);

        if (!ticket) {
            return res.render('error', { erro: "Ticket não encontrado!" });
        }

        const { name, type, price, description } = req.body;

        if (name) ticket.name = name;
        if (type) ticket.type = type;
        if (price) ticket.price = price;
        if (description) ticket.description = description;

        await ticket.save();

        res.status(200).json(ticket);
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao atualizar ticket!" });
    }
};

// Função para deletar um ticket
const deleteTicket = async (req, res) => {
    const ticketId = parseInt(req.params.id);

    try {
        const ticket = await Ticket.findByPk(ticketId);

        if (!ticket) {
            return res.render('error', { erro: "Ticket não encontrado!" });
        }

        await ticket.destroy();

        res.status(200).json(ticket);
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao deletar ticket!" });
    }
};

module.exports = {
    getTickets,
    getTicketByName,
    getUserTickets,
    getTicketsByPrice,
    buyTicket,
    registerTicket,
    updateTicket,
    deleteTicket
};
