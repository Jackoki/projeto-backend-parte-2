const { Sequelize } = require('sequelize');

// Criação da instância do Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT
    }
);

const authenticateDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    } 
    
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
};

authenticateDatabase();

module.exports = { sequelize }; // Export as an object
