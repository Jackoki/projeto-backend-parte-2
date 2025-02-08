const Country = require('../models/Country')

let countries = [
	new Country(1, 'Argentina', 'America', 'Spanish', 640.6, true), 
	new Country(2, 'Australia', 'Oceania', 'English', 1742, true), 
	new Country(3, 'Austria', 'Europe', 'German', 516, false), 
	new Country(4, 'Bangladesh', 'Asia', 'Bengali', 437.4, false), 
	new Country(5, 'Belgium', 'Europe', 'French', 632.2, true), 
	new Country(6, 'Brazil', 'America', 'Portuguese', 2174, true), 
	new Country(7, 'Canada', 'America', 'English', 2140, true), 
	new Country(8, 'Chile', 'America', 'Spanish', 335.5, true), 
	new Country(9, 'China', 'Asia', 'Chinese', 17790, false), 
	new Country(10, 'Colombia', 'America', 'Spanish', 363.9, true), 
	new Country(11, 'Democratic Republic of the Congo', 'Africa', 'French', 66.3, false), 
	new Country(12, 'Denmark', 'Europe', 'Danish', 404.2, true), 
	new Country(13, 'Ecuador', 'America', 'Spanish', 118.8, true), 
	new Country(14, 'Egypt', 'Africa', 'Arabic', 395.9, true), 
	new Country(15, 'Ethiopia', 'Africa', 'Amharic', 145, false), 
	new Country(16, 'Finland', 'Europe', 'Finnish', 300, true), 
	new Country(17, 'France', 'Europe', 'French', 3031, true), 
	new Country(18, 'Germany', 'Europe', 'German', 4456, true), 
	new Country(19, 'Ghana', 'Africa', 'English', 76, true), 
	new Country(20, 'Greece', 'Europe', 'Greek', 238, false), 
	new Country(21, 'India', 'Asia', 'Hindi', 3550, false), 
	new Country(22, 'Indonesia', 'Asia', 'Indonesian', 1371, false), 
	new Country(23, 'Iran', 'Asia', 'Persian', 401.5, false), 
	new Country(24, 'Italy', 'Europe', 'Italian', 2255, true), 
	new Country(25, 'Japan', 'Asia', 'Japanese', 4231, false), 
	new Country(26, 'Kenya', 'Africa', 'Swahili', 107, true), 
	new Country(27, 'Mexico', 'America', 'Spanish', 1790, true), 
	new Country(28, 'Netherlands', 'Europe', 'Dutch', 1118, true), 
	new Country(29, 'New Zealand', 'Oceania', 'English', 253.5, true), 
	new Country(30, 'Nigeria', 'Africa', 'English', 362.8, true), 
	new Country(31, 'Norway', 'Europe', 'Norwegian', 485.5, true), 
	new Country(32, 'Pakistan', 'Asia', 'Urdu', 338, true), 
	new Country(33, 'Paraguay', 'America', 'Spanish', 43, true), 
	new Country(34, 'Peru', 'America', 'Spanish', 267, true), 
	new Country(35, 'Philippines', 'Asia', 'Filipino', 437.1, true), 
	new Country(36, 'Poland', 'Europe', 'Polish', 811.2, true), 
	new Country(37, 'Portugal', 'Europe', 'Portuguese', 287.1, true), 
	new Country(38, 'Russia', 'Europe/Asia', 'Russian', 2021, true), 
	new Country(39, 'Saudi Arabia', 'Asia', 'Arabic', 1068, false), 
	new Country(40, 'South Africa', 'Africa', 'Zulu', 377.8, true), 
	new Country(41, 'South Korea', 'Asia', 'Korean', 1713, true), 
	new Country(42, 'Spain', 'Europe', 'Spanish', 1581, true), 
	new Country(43, 'Sweden', 'Europe', 'Swedish', 593.3, true), 
	new Country(44, 'Switzerland', 'Europe', 'German', 884.9, true), 
	new Country(45, 'Thailand', 'Asia', 'Thai', 514.9, true), 
	new Country(46, 'Turkey', 'Asia/Europe', 'Turkish', 1108, true), 
	new Country(47, 'United Arab Emirates', 'Asia', 'Arabic', 504.2, false), 
	new Country(48, 'United Kingdom', 'Europe', 'English', 3340, true), 
	new Country(49, 'United States of America', 'America', 'English', 29017,  true), 
	new Country(50, 'Vietnam', 'Asia', 'Vietnamese', 429.7, false)
];


const getNewId = () => {
    const ids = countries.map(country => country.id)
    const maxId = Math.max(...ids) + 1

    return maxId
}

module.exports = { countries,  getNewId }
