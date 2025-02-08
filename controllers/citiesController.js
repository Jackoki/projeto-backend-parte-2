const { cities, getNewId } = require('../data/databaseCities')
const { countries } = require('../data/databaseCountries')
const City = require('../models/City')

//Retorna todas as cidades
const getCities = (req, res) => {
    //Se a página não for informada, será iniciada na primeira página
    const { page = 1 } = req.query

    //Recebe o limite de valores a aparecer na página pela query, 
    //Se não for enviado, cada página terá apenas 5 países
    const limit = parseInt(req.query.limit, 10) || 5
   
    //Chamará a função de paginação a partir das requisições passadas
    return paginate(cities, page, limit, res)
}

//Retorna a cidade pelo nome passado pelo params
const getCityByName = (req, res) => {
    //Constante para receber o nome pela URL
    const cityName = req.params.name;
    
    //Constante para receber as informações da cidade pela busca no array usando o cityName
    const city = cities.find(c => c.name.toLowerCase().trim() === cityName.toLowerCase().trim());

    //Se não encontrar nada, retornará erro 404
    if (!city) {
        return res.status(404).json({ message: "Cidade não encontrada" });
    }

    //Retornará as informações se encontrar
    res.status(200).json(city)
}

//Função que retorna as cidades pelo pais passado na URL
const getCitiesByCountry = (req, res) => {
    //Se a página não for informada, será iniciada na primeira página
    const { page = 1 } = req.query

    //Recebe o limite de valores a aparecer na página pela query, 
    //Se não for enviado, cada página terá apenas 5 países
    const limit = parseInt(req.query.limit, 10) || 5

    //Constante para receber o nome do pais pela URL
    const countryName = req.params.countryName;
    
    //Constante do pais para receber as informações do pais pelo nome
    const country = countries.find(c => c.name.toLowerCase().trim() === countryName.toLowerCase().trim());

    //Se não encontrar o pais, retornará erro 404
    if (!country) {
        return res.status(404).json({ message: "País não encontrada" });
    }

    //Procura no array cities do database as cidades com o id do pais filtrado anteriormente
    const citiesByCountry = cities.filter(c => c.idCountry === country.id)

    //Se não encontrar nenhuma cidade, retornará erro 404
    if (citiesByCountry.length === 0) {
        return res.status(404).json({ message: "Cidades não encontradas" });
    }


    //Chamará a função de paginação a partir das requisições passadas
    return paginate(citiesByCountry, page, limit, res)
}

//Função para registro de paises
const registerCity = (req, res) => {
    //Constante para receber as informações do body
    const newCity =  req.body

    //Analisa se está faltando informações e os tipos de variaveis do body, se entrar na condição chamará o erro 400, caso contrário irá registrar a cidade
    if (!newCity.name || typeof newCity.population !== 'number' || typeof newCity.idCountry !== 'number') {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios ou os tipos de dados estão incorretos' });
    }
    
    else{
        //Criação da cidade pelo Model City e as informações passadas
        const cityCreated = new City(getNewId(), newCity.name, newCity.population, newCity.idCountry)
    
        //Push do cityCreated no vetor cities
        cities.push(cityCreated)

        //Se der certo, retornará as informações da cidade passada
        res.status(200).json(cityCreated)
    }
}

//Função para atualizar as informações de uma cidade
const updateCity = (req, res) => {
    //Constante para resgatar o id da cidade pela URL
    const cityId = parseInt(req.params.id);

    //Procura a cidade pelo ID, se não encontrar, acionará o erro 404
    const cityFound = cities.find(c => c.id === cityId)
    if (!cityFound) {
        return res.status(404).json({ message: "Cidade não encontrada" });
    }

    //Vetor com as propriedades que serão atualizadas no country
    const properties = ['name', 'population']

    //Para cada propriedade do body que é igual dos valores do properties, realizamos a atualização da informação no cityFound
    Object.keys(req.body).forEach(key => {
        if(properties.includes(key)) {
            //Analisamos se a chave é population, se for, analisamos se o envio passado é um número ou não, caso não seja, ignorará essa parte do update
            if(key === 'population') {
                if(typeof req.body[key] === 'number'){
                    cityFound[key] = req.body[key]
                }
            }

            //Se não a propriedade acima, atualizará o nome
            else {
                cityFound[key] = req.body[key]
            }
        }
    })

    //Caso a atualização funcione, retornará a cidade alterada
    res.status(200).json(cityFound)
}

//Função para deletar a cidade
const deleteCity = (req, res) => {

    //Constante para receber o ID da cidade pela URL
    const cityId = parseInt(req.params.id, 10);

    //Se não encontrar a cidade com o cityId, acionará o erro 404
    const cityFound = cities.findIndex(c => c.id === cityId);
    if(cityFound === -1){
        return res.status(404).json({ message: 'Cidade não encontrada.' });
    }

    //Criação de vetor para retorno, realiza o splice para retirar a cidade no database
    const [deletedCity] = cities.splice(cityFound, 1);

    res.status(200).json(deletedCity);
}


//Nessa informação passamos 4 parâmetros, o array (database), a quantidade de páginas, limite da página e as requisições dass cidades
const paginate = (database, page, limit, res) => {
    // Se o limite da página passada não for 5, 10 ou 30, será acionado um erro
    if (![5, 10, 30].includes(limit)) {
        return res.status(400).json({ message: 'O limite deve ser 5, 10 ou 30 países por página' });
     }

    //Variável e não constante para receber a última página da consulta
    let lastPage = 1

    //Constante que recebe o total de paises do vetor
    const quantityCities = database.length


    //Analisa a quantidade de paises passados, se for diferente de zero, entrará na analise
    //Casso contrário, acionará o erro do else
    if(quantityCities !== 0) {
        const alfabeticalOrderCities = [...database].sort((a, b) => {
            // Compara os nomes dos países em ordem alfabética (case-insensitive)
            return a.name.localeCompare(b.name);
        });

        // Calcula a última página
        lastPage = Math.ceil(quantityCities / limit);

        //Se a página enviada for maior que a última página ou menor que 1, acionará o erro 400
        if (page < 1 || page > lastPage) {
            return res.status(400).json({ message: "Página inválida" });
        }

        // Calcula o índice inicial e final com base na página e no limite
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Pega a fatia dos países conforme a página e limite
        const citiesPage = alfabeticalOrderCities.slice(startIndex, endIndex);

        //Retorna a paginação pelos dados enviados
        return res.status(200).json({
            cities: citiesPage,
            currentPage: page,
            lastPage: lastPage,
            totalCities: quantityCities
        });
    }

    //Se não encontrar nenhuma cidade, retornará erro 400
    else {
        return res.status(400).json({ message: "Não foi encontrado nenhum registro de cidade" });
    }
}


module.exports = {
    getCities,
    getCityByName,
    getCitiesByCountry,
    registerCity,
    updateCity,
    deleteCity
}
