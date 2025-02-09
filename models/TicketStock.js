const { DataTypes } = require('sequelize');
const { sequelize } = require('../helpers/db');
const User = require('./User');
const Ticket = require('./Ticket');

const TicketStock = sequelize.define('TicketStock', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, 
{
    tableName: 'ticket_stock',
    timestamps: true
});

TicketStock.belongsTo(User, { foreignKey: 'userId' });
TicketStock.belongsTo(Ticket, { foreignKey: 'ticketId' });

module.exports = TicketStock;
