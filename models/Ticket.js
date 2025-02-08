const Ticket = function (id, name, price) {
    this.id = id
    this.name = name
    this.price = price

    this.getId = function() {
        return this.id
    }

    this.getName = function() {
        return this.name
    }

    this.getPrice = function() {
        return this.price
    }
}

module.exports = Ticket