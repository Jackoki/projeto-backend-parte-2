require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const { urlNotValid } = require('./middlewares/auth.js');
const { sequelize } = require('./helpers/db');

//Importação das rotas
const usersRoutes = require('./routes/usersRoutes');
const ticketsRoutes = require('./routes/ticketsRoutes');
const renderRoutes = require('./routes/renderRoutes');

//Importação do Mustache
const mustacheExpress = require("mustache-express");
const engine = mustacheExpress()

const app = express();
app.use(express.json());

// Middleware para passar informações do navegador para o back-end
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas principais
app.use('/users', usersRoutes);
app.use('/tickets', ticketsRoutes);
app.use('/', renderRoutes)



// Middleware para rota não encontrada
app.use(urlNotValid);

//Variáveis para compilar o mustache
app.engine("mustache", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

// Função assíncrona para criar as tabelas no MySQL caso elas não existam ao compilar o projeto na porta 4000
(async () => {
  try {
    await sequelize.sync();
    app.listen(4000, () => console.log("Servidor rodando na porta 4000"));
  } 
  
  catch (error) {
    console.error("Erro ao sincronizar o banco de dados:", error);
  }
})();
