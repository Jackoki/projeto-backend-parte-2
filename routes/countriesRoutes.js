const express = require('express')

//Importação dos middlewares de autenticação
//VerifyToken é usado para verificar o Token de Login
//isAdm analisa se o token do usuário logado tem permissão ou não de administrador
const {verifyToken, isAdm} = require('../middlewares/auth.js')
const router = express.Router()

//Chamada de funções dos controllers das rotas criadas
const countriesController = require('../controllers/countriesController')

//Funções get para retornar todos os paises, um pais especifico
//Paises de um continente, paises de uma língua, paises que permitem a dupla cidadania
router.get('/', verifyToken, countriesController.getCountries)
router.get('/:name', verifyToken, countriesController.getCountryByName)
router.get('/continent/:continent', verifyToken, countriesController.getCountriesByContinent)
router.get('/language/:language', verifyToken, countriesController.getCountriesByLanguage)
router.get('/citizenship/:allowMultipleCitizenship', verifyToken, countriesController.getCountriesByAMC)

//Rota para registro de um pais
router.post('/registerCountry', verifyToken, isAdm, countriesController.registerCountry)

//Rota para atualizar informações de um pais
router.put('/:id', verifyToken, isAdm, countriesController.updateCountry)

//Rota para deletar um pais
router.delete('/:id', verifyToken, isAdm, countriesController.deleteCountry)

module.exports = router
