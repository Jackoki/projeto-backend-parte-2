const Ticket = require('../models/Ticket')

let tickets = [
	new Ticket(1, 'Argentina', 'America', 'Spanish', 640.6, true), 
	new Ticket(2, 'Australia', 'Oceania', 'English', 1742, true), 
	new Ticket(3, 'Austria', 'Europe', 'German', 516, false), 
	new Ticket(4, 'Bangladesh', 'Asia', 'Bengali', 437.4, false), 
	new Ticket(5, 'Belgium', 'Europe', 'French', 632.2, true)
];


const getNewId = () => {
    const ids = tickets.map(ticket => ticket.id)
    const maxId = Math.max(...ids) + 1

    return maxId
}

module.exports = { tickets,  getNewId }
