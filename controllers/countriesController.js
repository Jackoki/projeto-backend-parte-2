const { countries, getNewId } = require('../data/databaseCountries')
const Country = require('../models/Country')

//Função para retornar todos os paises
const getCountries = (req, res) => {
    //Se a página não for informada, será iniciada na primeira página
    const { page = 1 } = req.query

     //Recebe o limite de valores a aparecer na página pela query, 
     //Se não for enviado, cada página terá apenas 5 países
     const limit = parseInt(req.query.limit, 10) || 5

     //Chamará a função de paginação a partir das requisições passadas
     return paginate(countries, page, limit, res)
}

//Função que retorna as informações do pais pelo nome passado no params
const getCountryByName = (req, res) => {
    //Constante para receber o nome passado no params
    const countryName = req.params.name;
    
    //Procurará no database os paises que contém o nome passado
    //Uso de lowercase para evitar problemas de case sensitive
    const country = countries.find(c => c.name.toLowerCase().trim() === countryName.toLowerCase().trim());

    //Se não encontrar os paises, retorna o erro 404
    if (!country) {
        return res.status(404).json({ message: "País não encontrado" });
    }

    //Retorno caso tenha encontrado
    res.status(200).json(country)
}


//Função que retornará paises pelo parametro do continente passado pelo params
const getCountriesByContinent = (req, res) => {
    
    //Caso a página não seja passada, o padrão começara na primeira página
    const { page = 1 } = req.query

     //Recebe o limite de valores a aparecer na página pela query, 
     //Se não for enviado, cada página terá apenas 5 países
    const limit = parseInt(req.query.limit, 10) || 5

    //Recebe o nome do continente pelo params
    const continentName = req.params.continent;
    
    //Procurará no database os paises que contém o continente passado
    //Uso de lowercase para evitar problemas de case sensitive
    const continent = countries.filter(c => c.continent.toLowerCase().trim() === continentName.toLowerCase().trim());

    //Se não encontrar nenhum pais do continente passado, retornará erro 404
    if (!continent) {
        return res.status(404).json({ message: "Continente não encontrado" });
    }

    //Chamará a função de paginação a partir das requisições filtradas
    return paginate(continent, page, limit, res)
}


//Função que retornará paises pelo parametro da língua passada pelo params
const getCountriesByLanguage = (req, res) => {
    
    //Caso a página não seja passada, o padrão começara na primeira página
    const { page = 1 } = req.query

     //Recebe o limite de valores a aparecer na página pela query, 
     //Se não for enviado, cada página terá apenas 5 países
    const limit = parseInt(req.query.limit, 10) || 5


    //Recebe a língua pelo params
    const languageName = req.params.language;

     //Procurará no database os paises que contém a lingua passada
    //Uso de lowercase para evitar problemas de case sensitive
    const language = countries.filter(c => c.language.toLowerCase().trim() === languageName.toLowerCase().trim());


    //Se não encontrar nenhum pais com a lingua passada, retornará erro 404
    if (language.length === 0) {
        return res.status(404).json({ message: "Língua não encontrada" });
    }

    //Chamará a função de paginação a partir das requisições filtradas
    return paginate(language, page, limit, res)
}



//Função que retornará paises pelo parametro de true ou false de allowMultipleCitizenship pelo params
const getCountriesByAMC = (req, res) => {

    //Caso a página não seja passada, o padrão começara na primeira página
    const { page = 1 } = req.query

     //Recebe o limite de valores a aparecer na página pela query, 
     //Se não for enviado, cada página terá apenas 5 países
    const limit = parseInt(req.query.limit, 10) || 5
    
    
    //Recebe a allowMultipleCitizenship pelo params
    const countryAMCParam  = req.params.allowMultipleCitizenship;

    //Como o parâmetro enviado é um booleano, fazemos uma conversão em que analisamos se é true ou false
    //Se o parâmetro enviado for true, o countryAMC receberá true, se não for, receberá false
    const countryAMC = (countryAMCParam === 'true');
    

    //Procurará no database os paises que contém o allowMultipleCitizenship
    const AMC = countries.filter(c => c.allowMultipleCitizenship === countryAMC);

    //Se não encontrar, retornará erro 404
    if (AMC.length === 0) {
        return res.status(404).json({ message: "País não encontrado" });
    }

    
    //Chamará a função de paginação a partir das requisições filtradas
    return paginate(AMC, page, limit, res)
}

//Função para cadastro de pais
const registerCountry = (req, res) => {
    //Constante para receber o body da requisição
    const newCountry =  req.body

    //Analisamos se os parâmetros enviados estiverem vazio, será acionado o erro
    //O gdp analisa se o parâmetro enviado é um número ou não
    //O allowMultipleCitizenship analisa se o parâmetro enviado é um booleano ou não
    if (!newCountry.name || !newCountry.continent || !newCountry.language || typeof newCountry.gdp !== 'number' || typeof newCountry.allowMultipleCitizenship !== 'boolean') {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios ou os tipos de parâmetros estão incorretos' });
    }

    else{
        //Cria um pais a partir do model, gera o ID automaticamente e preenche os valores pelo body
        const countryCreated = new Country(getNewId(), newCountry.name, newCountry.continent, newCountry.language, newCountry.gdp, newCountry.allowMultipleCitizenship)

        //Push no vetor do countries
        countries.push(countryCreated)

        //Retorna o pais criado
        res.status(200).json(countryCreated)
    }
}

//Função para atualizar informações de um pais pelo ID
const updateCountry = (req, res) => {
    //Constante para receber o ID pela url
    const countryId = parseInt(req.params.id);

    //Procurará os paises a partir do id passado
    const countryFound = countries.find(c => c.id === countryId)

    //Se não encontrar o ID passado, retornará erro 404
    if (!countryFound) {
        return res.status(404).json({ message: "País não encontrado" });
    }

    //Vetor com as propriedades que serão atualizadas no country
    const properties = ['name', 'continent', 'language', 'gdp', 'allowMultipleCitizenship']

    //Para cada propriedade do body que é igual dos valores do properties, realizamos a atualização da informação no countryFound
    Object.keys(req.body).forEach(key => {
        if(properties.includes(key)) {
            //Analisamos se a chave é gdp, se for, analisamos se o envio passado é um número ou não, caso não seja, ignorará essa parte do update
            if(key === 'gdp') {
                if(typeof req.body[key] === 'number'){
                    countryFound[key] = req.body[key]
                }
            }

            
            //Analisamos se a chave é AMC, se for, analisamos se o envio passado é um booleano ou não, caso não seja, ignorará essa parte do update
            else if(key === 'allowMultipleCitizenship'){
                if(typeof req.body[key] === 'boolean'){
                    countryFound[key] = req.body[key]
                }
            }

            //Se não for nenhuma das 2 propriedades acima, atualizará as propriedades passadas
            else {
                countryFound[key] = req.body[key]
            }
        }
    })

    //Caso a atualização funcione, retornará o pais alterado
    res.status(200).json(countryFound)
}

const deleteCountry = (req, res) => {
    //Pegamos o ID do pais passado pela URL
    const countryId = parseInt(req.params.id, 10);

    //Procuramos o index do pais pelo id do parametro.
    const countryIndex = countries.findIndex(c => c.id === countryId)
    
    //Se não encontrar o pais, retornará erro 404
    if(countryIndex === -1){
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
   
    //Remove o pais do array
    const [deletedCountry] = countries.splice(countryIndex, 1);

    //Retorna as informações do pais deletado
    res.status(200).json(deletedCountry)
}


//Nessa informação passamos 4 parâmetros, o array (database), a quantidade de páginas, limite da página e as requisições do pais
const paginate = (database, page, limit, res) => {
    // Se o limite da página passada não for 5, 10 ou 30, será acionado um erro
    if (![5, 10, 30].includes(limit)) {
        return res.status(400).json({ message: 'O limite deve ser 5, 10 ou 30 países por página' });
     }

    //Variável e não constante para receber a última página da consulta
    let lastPage = 1

    //Constante que recebe o total de paises do vetor
    const quantityCountries = database.length


    //Analisa a quantidade de paises passados, se for diferente de zero, entrará na analise
    //Casso contrário, acionará o erro do else
    if(quantityCountries !== 0) {
        const alfabeticalOrderCountries = [...database].sort((a, b) => {
            // Compara os nomes dos países em ordem alfabética (case-insensitive)
            return a.name.localeCompare(b.name);
        });

        // Calcula a última página
        lastPage = Math.ceil(quantityCountries / limit);

        //Se a página enviada for maior que a última página ou menor que 1, acionará o erro 400
        if (page < 1 || page > lastPage) {
            return res.status(400).json({ message: "Página inválida" });
        }

        // Calcula o índice inicial e final com base na página e no limite
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Pega a fatia dos países conforme a página e limite
        const countriesPage = alfabeticalOrderCountries.slice(startIndex, endIndex);

        //Retorna a paginação pelos dados enviados
        return res.status(200).json({
            countries: countriesPage,
            currentPage: page,
            lastPage: lastPage,
            totalCountries: quantityCountries
        });
    }

    //Se não encontrar nenhum pais, retornará erro 400
    else {
        return res.status(400).json({ message: "Não foi encontrado nenhum registro de países" });
    }
}

module.exports = {
    getCountries,
    getCountryByName,
    getCountriesByContinent,
    getCountriesByLanguage,
    getCountriesByAMC,
    registerCountry,
    updateCountry,
    deleteCountry
}
