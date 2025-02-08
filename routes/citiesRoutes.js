const express = require('express')

//Importação dos middlewares de autenticação
//VerifyToken é usado para verificar o Token de Login
//isAdm analisa se o token do usuário logado tem permissão ou não de administrador
const {verifyToken, isAdm} = require('../middlewares/auth.js')
const router = express.Router()
const citiesController = require('../controllers/citiesController')

//Funções get para retornar as cidades
router.get('/', verifyToken, citiesController.getCities)
router.get('/:name', verifyToken, citiesController.getCityByName)
router.get('/country/:countryName', verifyToken, citiesController.getCitiesByCountry)

//Função post para registrar uma cidade
router.post('/registerCity', verifyToken, isAdm, citiesController.registerCity)

//Função put para atualizar uma cidade
router.put('/:id', verifyToken, isAdm, citiesController.updateCity)

//Funçao delete para apagar uma cidade
router.delete('/:id', verifyToken, isAdm, citiesController.deleteCity)

module.exports = router
