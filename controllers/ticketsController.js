const { tickets, getNewId } = require('../data/databaseTickets');
const Ticket = require('../models/Ticket');

// Função para retornar todos os tickets com paginação
const getTickets = (req, res) => {
    const { page = 1 } = req.query;
    const limit = parseInt(req.query.limit, 10) || 5;
    return paginate(tickets, page, limit, res);
};

// Função que retorna informações de um ticket pelo nome passado no params
const getTicketByName = (req, res) => {
    const ticketName = req.params.name;
    const ticket = tickets.find(t => t.name.toLowerCase().trim() === ticketName.toLowerCase().trim());

    if (!ticket) {
        return res.status(404).json({ message: "Ticket não encontrado" });
    }

    res.status(200).json(ticket);
};

// Função que retorna tickets pelo tipo passado no params
const getTicketsByPrice = (req, res) => {
    const { page = 1 } = req.query;
    const limit = parseInt(req.query.limit, 10) || 5;
    const ticketPrice = parseFloat(req.params.price);

    if (isNaN(ticketPrice)) {
        return res.status(400).json({ message: "Preço inválido" });
    }

    const filteredTickets = tickets.filter(t => t.price === ticketPrice);

    if (filteredTickets.length === 0) {
        return res.status(404).json({ message: "Nenhum ticket encontrado para o preço especificado" });
    }

    return paginate(filteredTickets, page, limit, res);
};


// Função para registrar um novo ticket
const registerTicket = (req, res) => {
    const newTicket = req.body;

    if (!newTicket.name || !newTicket.type || typeof newTicket.price !== 'number' || !newTicket.description) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios ou os tipos de parâmetros estão incorretos' });
    }

    const ticketCreated = new Ticket(getNewId(), newTicket.name, newTicket.type, newTicket.price, newTicket.description);
    tickets.push(ticketCreated);
    res.status(200).json(ticketCreated);
};

// Função para atualizar informações de um ticket pelo ID
const updateTicket = (req, res) => {
    const ticketId = parseInt(req.params.id);
    const ticketFound = tickets.find(t => t.id === ticketId);

    if (!ticketFound) {
        return res.status(404).json({ message: "Ticket não encontrado" });
    }

    const properties = ['name', 'type', 'price', 'description'];

    Object.keys(req.body).forEach(key => {
        if (properties.includes(key)) {
            if (key === 'price' && typeof req.body[key] === 'number') {
                ticketFound[key] = req.body[key];
            } else if (key !== 'price') {
                ticketFound[key] = req.body[key];
            }
        }
    });

    res.status(200).json(ticketFound);
};

// Função para deletar um ticket pelo ID
const deleteTicket = (req, res) => {
    const ticketId = parseInt(req.params.id, 10);
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);

    if (ticketIndex === -1) {
        return res.status(404).json({ message: 'Ticket não encontrado.' });
    }

    const [deletedTicket] = tickets.splice(ticketIndex, 1);
    res.status(200).json(deletedTicket);
};

// Função para paginação
const paginate = (database, page, limit, res) => {
    if (![5, 10, 30].includes(limit)) {
        return res.status(400).json({ message: 'O limite deve ser 5, 10 ou 30 itens por página' });
    }

    const totalItems = database.length;

    if (totalItems === 0) {
        return res.status(400).json({ message: "Nenhum registro encontrado" });
    }

    const lastPage = Math.ceil(totalItems / limit);

    if (page < 1 || page > lastPage) {
        return res.status(400).json({ message: "Página inválida" });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const itemsPage = database.slice(startIndex, endIndex);

    return res.status(200).json({
        items: itemsPage,
        currentPage: page,
        lastPage: lastPage,
        totalItems: totalItems
    });
};

module.exports = {
    getTickets,
    getTicketByName,
    getTicketsByPrice,
    registerTicket,
    updateTicket,
    deleteTicket
};
