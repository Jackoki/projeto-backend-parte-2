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

        res.render('buyTickets', {items: tickets, totalItems: tickets.length});
    } 
    
    catch (error) {
        console.log(error)
        res.render('error', { erro: "Erro ao consultar tickets!", route: '/main-page-user' });
    }
};


// Função que retorna informações de um ticket pelo nome
const getTicketByName = async (req, res) => {
    const { ticketName } = req.query;

    try {
        const ticketData = await sequelize.query(
            `SELECT t.name, t.price, ts.quantity 
            FROM tickets t
            LEFT JOIN ticket_stock ts ON t.id = ts.ticketId
            WHERE UPPER(t.name) LIKE UPPER(:ticketName)`, 
            {
                replacements: { ticketName: `%${ticketName}%`},
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (ticketData.length === 0) {
            return res.render('error', { erro: "Ticket não encontrado!", route: '/main-page-user' });
        }

        const ticket = ticketData[0];
        res.render('ticketSearch', { items: [ticket]});
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao consultar ticket!", route: '/main-page-user' });
    }
};


// Função que retorna tickets pelo preço
const getTicketsByPrice = async (req, res) => {
    const { ticketPrice } = req.query;

    if (isNaN(ticketPrice)) {
        return res.render('error', { erro: "Preço inválido!", route: '/main-page-user' });
    }

    try {
        const ticketsData = await sequelize.query(
            `SELECT t.name, t.price, ts.quantity 
            FROM tickets t
            LEFT JOIN ticket_stock ts ON t.id = ts.ticketId
            WHERE t.price <= :ticketPrice`, 
            {
                replacements: { ticketPrice },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (ticketsData.length === 0) {
            return res.render('error', { erro: "Nenhum ticket com o preço inserido!", route: '/main-page-user' });
        }

        res.render('ticketSearch', { 
            items: ticketsData,
            totalItems: ticketsData.length 
        });
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao buscar o ticket!", route: '/main-page-user' });
    }
};


const getUserTickets = async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.render('error', { erro: "Usuário inválido!", route: '/' });
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
            return res.render('error', { erro: "Nenhum ingresso encontrado!", route: '/main-page-user' });
        }

        return res.render('myTickets', {items: userTickets, userTickets: userTickets.length});
    } 
    
    catch (error) {
        res.render('error', { erro: "Erro ao buscar os tickets!", route: '/main-page-user' });
    }
};

// Função para registrar um novo ticket
const registerTicket = async (req, res) => {
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
    }    

    if (isNaN(quantity) || quantity < 0) {
        return res.status(400).json({ erro: "Quantidade inválida!" });
    }    

    try {
        const newTicket = await Ticket.create({
            name,
            price,
        });

        const newTicketStock = await TicketStock.create({
            ticketId: newTicket.id,
            quantity,
        });

        res.status(200).json({
            ticket: newTicket,
            ticketStock: newTicketStock,
        });
    } 
    
    catch (error) {
        return res.status(500).json({ erro: "Erro ao criar o ticket e o estoque!" });
    }
};


const buyTicket = async (req, res) => {
    const { tickets } = req.body;
    const userId = req.user.id;
    
    if (!userId || !tickets || Object.keys(tickets).length === 0) {
        return res.render('error', { erro: "Usuário ou ingressos informados incorretamente!" });
    }

    const transaction = await sequelize.transaction();

    try {
        for (const ticketKey in tickets) {
            const { id, quantity } = tickets[ticketKey];

            if (!id || quantity <= 0) {
                continue;
            }

            const stock = await TicketStock.findOne({
                where: { ticketId: id },
                transaction,
            });

            if (!stock || stock.quantity < quantity) {
                throw new Error(`Estoque insuficiente para o ingresso ID ${id}.`);
            }

            stock.quantity -= quantity;
            await stock.save({ transaction });

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

        await transaction.commit();
        return res.render('success', { message: "Compra feita com sucesso!", route: "/main-page-user" });
    } 
    
    catch (error) {
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
            return res.status(404).json({ erro: "Ticket não encontrado!" });
        }        

        const { name, price, quantity } = req.body;

        if (name){
            ticket.name = name;
        }

        if (price){
            ticket.price = price;
        } 

        await ticket.save();

        const ticketStock = await TicketStock.findOne({ where: { ticketId: ticketId } });

        if (ticketStock) {
            if (quantity !== undefined) {
                ticketStock.quantity = quantity;
                await ticketStock.save();
            }
        } 
        
        else {
            if (quantity !== undefined) {
                await TicketStock.create({
                    ticketId: ticketId,
                    quantity: quantity
                });
            }
        }

        res.status(200).json(ticket);
    } 
    
    catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar o estoque do ticket!" });
    }
};


// Função para deletar um ticket
const deleteTicket = async (req, res) => {
    const ticketId = parseInt(req.params.id);

    try {
        const ticket = await Ticket.findByPk(ticketId);

        if (!ticket) {
            return res.status(404).json({ erro: "Ticket não encontrado!" });
        }

        await ticket.destroy();

        res.status(200).json(ticket);
    } 
    
    catch (error) {
        return res.status(500).json({ erro: "Erro ao deletar o ticket!" });
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
