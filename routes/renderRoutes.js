const {verifyToken, isAdm} = require('../middlewares/auth.js')
const express = require('express');
const router = express.Router();

// Rota para a página de login
router.get('/', (req, res) => {
    res.render('home', { titulo: "Bem-vindo!" });
});

// Rota para a página de registrar
router.get('/register', (req, res) => {
    res.render('register');
});

// Rota para a página principal como Usuário
router.get('/main-page-user', verifyToken, (req, res) => {
    res.render('mainPageUser');
});

// Rota para a página principal como Usuário
router.get('/main-page-admin', verifyToken, (req, res) => {
    res.render('mainPageAdmin');
});

// Rota para a página principal como Usuário
router.get('/my-tickets', verifyToken, (req, res) => {
    res.render('buyTickets');
});



module.exports = router;
