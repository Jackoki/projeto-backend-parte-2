const City = require('../models/City')

let cities = [
	new City(1, 'Buenos Aires', 3.121, 1),
	new City(2, 'Canberra', 0.356, 2), 
	new City(3, 'Vienna', 2.015, 3), 
	new City(4, 'Dhaka', 21.280, 4), 
	new City(5, 'Brussels', 0.188, 5), 
	new City(6, 'Brasilia', 2.817, 6), 
	new City(7, 'Ottawa', 1.071, 7), 
	new City(8, 'Santiago', 6.951, 8), 
	new City(9, 'Shangai', 24.870, 9), 
	new City(10, 'Bogotá', 7.930, 10), 
	new City(11, 'Kinshasa', 17.071, 11), 
	new City(12, 'Copenhagen', 0.638, 12), 
	new City(13, 'Quito', 1.763, 13), 
	new City(14, 'Cairo', 10.200, 14), 
	new City(15, 'Adis Abeba', 3.791, 15), 
	new City(16, 'Helsinki', 0.656, 16), 
	new City(17, 'Paris', 2.103, 17), 
	new City(18, 'Berlin', 3.432, 18), 
	new City(19, 'Accra', 1.963, 19), 
	new City(20, 'Athens', 0.643, 20), 
	new City(21, 'New Delhi', 33.807, 21), 
	new City(22, 'Jakarta', 10.67, 22), 
	new City(23, 'Tehran', 9.616, 23), 
    new City(24, 'Rome', 2.873, 24), 
    new City(25, 'Tokyo', 13.515, 25), 
    new City(26, 'Nairobi', 4.397, 26), 
    new City(27, 'Mexico City', 9.209, 27), 
    new City(28, 'Amsterdam', 0.872, 28), 
    new City(29, 'Wellington', 0.215, 29), 
    new City(30, 'Lagos', 14.862, 30), 
    new City(31, 'Oslo', 0.697, 31), 
    new City(32, 'Islamabad', 1.015, 32), 
    new City(33, 'Asunción', 0.525, 33), 
    new City(34, 'Lima', 8.894, 34), 
    new City(35, 'Manila', 1.780, 35), 
    new City(36, 'Warsaw', 1.790, 36), 
    new City(37, 'Lisbon', 0.508, 37), 
    new City(38, 'Moscow', 12.655, 38), 
    new City(39, 'Riyadh', 7.676, 39), 
    new City(40, 'Cape Town', 4.618, 40), 
    new City(41, 'Seoul', 9.963, 41), 
    new City(42, 'Madrid', 3.223, 42), 
    new City(43, 'Stockholm', 0.975, 43), 
    new City(44, 'Zurich', 0.402, 44), 
    new City(45, 'Bangkok', 10.539, 45), 
    new City(46, 'Istanbul', 15.462, 46), 
    new City(47, 'Abu Dhabi', 1.510, 47), 
    new City(48, 'London', 8.982, 48), 
    new City(49, 'Washington D.C', 0.678, 49), 
    new City(50, 'Hanoi', 8.053, 50)
];


const getNewId = () => {
    const ids = cities.map(city => city.id)
    const maxId = Math.max(...ids) + 1

    return maxId
}

module.exports = { cities,  getNewId }
