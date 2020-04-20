const Location = require('./Location.js')

class Country extends Location {
    constructor(name, description, image, x, y, width, height, locationsMap, religion, wealth) {
        super(name, description, image, x, y, width, height, locationsMap)
        this.religion = religion;
        this.wealth = wealth;
    }
}


Country.POOR = 'poor';
Country.AVERAGE = 'average';
Country.RICH = 'rich';

module.exports = Country;
