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


module.exports = router;
