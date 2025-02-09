//Importação de frameworks e funções no projeto, uso de dotenv para o auth.
require('dotenv').config();
const express = require('express')
const {urlNotValid} = require('./middlewares/auth.js')
const usersRoutes = require('./routes/usersRoutes')
const ticketsRoutes = require('./routes/ticketsRoutes')
const app = express()

app.use(express.json())

//O servidor na porta 3000, tendo 3 rotas principais, /users, /tickets.
app.use('/users', usersRoutes)
app.use('/tickets', ticketsRoutes)

//Chamada de middleware do arquivo auth.js para caso não encontre a rota
app.use(urlNotValid)

app.listen(4000, () => console.log("Servidor rodando na porta 4000"))