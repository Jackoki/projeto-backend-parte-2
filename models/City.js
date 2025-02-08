const City = function (id, name, population, idCountry) {
    this.id = id
    this.name = name
    this.population = population
    this.idCountry = idCountry

    this.getId = function() {
        return this.id
    }

    this.getName = function() {
        return this.name
    }

    this.getPopulation = function() {
        return this.population
    }

    this.getIdCountry = function() {
        return this.idCountry
    }
}

module.exports = City
