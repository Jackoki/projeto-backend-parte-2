const Ticket = require('../models/Ticket');
const TicketStock = require('../models/TicketStock');
const UserTicket = require('../models/UserTickets');
const { sequelize } = require('../helpers/db');

// Função para retornar todos os tickets com paginação
const getTickets = async (req, res) => {
    try {
        const tickets = await sequelize.query(
            `SELECT t.id, t.price, t.name, ts.quantity
            FROM db_backend_2.ticket_stock ts
            INNER JOIN db_backend_2.tickets t ON (t.id = ts.ticketId)`,

            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Retorna todos os tickets sem paginação
        res.render('buyTickets', {items: tickets, totalItems: tickets.length});
    } 
    
    catch (error) {
        console.log(error)
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
    const userId = req.user.id;

    if (!userId) {
        return res.render('error', { erro: "Usuário não encontrado!" });
    }

    try {
        const userTickets = await sequelize.query(
            `SELECT t.name, t.price, SUM(ut.quantity) AS quantity
            FROM db_backend_2.user_tickets ut
            INNER JOIN db_backend_2.tickets t ON t.id = ut.ticketId
            WHERE ut.userId = :userId
            GROUP BY t.name, t.price
            ORDER BY t.name;`,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (userTickets.length === 0) {
            return res.render('error', { erro: "Nenhum ingresso encontrado para este usuário!" });
        }

        return res.render('myTickets', {items: userTickets, userTickets: userTickets.length});
    } 
    
    catch (error) {
        console.error(error);
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
    const { tickets } = req.body;
    const userId = req.user.id;

    // Debugging para entender a estrutura dos dados
    console.log("Dados recebidos no servidor:", JSON.stringify(req.body, null, 2));

    // Validações iniciais
    if (!userId || !tickets || Object.keys(tickets).length === 0) {
        return res.render('error', { erro: "Usuário ou ingressos informados incorretamente!" });
    }

    const transaction = await sequelize.transaction();

    try {
        for (const ticketKey in tickets) {
            const { id, quantity } = tickets[ticketKey];

            if (!id || quantity <= 0) {
                continue; // Ignora entradas inválidas
            }

            // Verifica a quantidade no estoque
            const stock = await TicketStock.findOne({
                where: { ticketId: id },
                transaction,
            });

            if (!stock || stock.quantity < quantity) {
                throw new Error(`Estoque insuficiente para o ingresso ID ${id}.`);
            }

            // Atualiza o estoque
            stock.quantity -= quantity;
            await stock.save({ transaction });

            // Registra a compra
            await UserTicket.create(
                {
                    userId,
                    ticketId: id,
                    quantity,
                    status: 'completed',
                    purchaseDate: new Date(),
                },
                { transaction }
            );
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
