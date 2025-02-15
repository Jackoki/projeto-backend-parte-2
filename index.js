require('dotenv').config();

const path = require('path');
const express = require('express');

const { urlNotValid } = require('./middlewares/auth.js');
const { sequelize } = require('./helpers/db');

//Importação das rotas
const usersRoutes = require('./routes/usersRoutes');
const ticketsRoutes = require('./routes/ticketsRoutes');

//Importação do Mustache
const mustacheExpress = require("mustache-express");
const engine = mustacheExpress()

const app = express();
app.use(express.json());

// Rotas principais
app.use('/users', usersRoutes);
app.use('/tickets', ticketsRoutes);

//Criação da rota sem nada para renderizar o arquivo Home.mustache para o usuário realizar o login
app.get('/', (req, res) => {
  res.render('home', { titulo: "Bem-vindo!" });
});

// Middleware para rota não encontrada
app.use(urlNotValid);

//Variáveis para rodar o mustache
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
