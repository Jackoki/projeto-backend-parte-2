const Country = function (id, name, continent, language, gdp, allowMultipleCitizenship) {
    this.id = id
    this.name = name
    this.continent = continent
    this.language = language
    this.gdp = gdp
    this.allowMultipleCitizenship = allowMultipleCitizenship

    this.getId = function() {
        return this.id
    }

    this.getName = function() {
        return this.name
    }

    this.getContinent = function() {
        return this.continent
    }

    this.getLanguage = function() {
        return this.language
    }

    this.getGdp = function() {
        return this.gdp
    }

    this.getAllowMultipleCitizenship = function() {
        return this.allowMultipleCitizenship
    }
}

module.exports = Country