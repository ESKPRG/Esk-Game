const Entity = require('./Entity.js')

class Country extends Entity {
    constructor(id, name, description, image, x, y, width, height, locationsMap, religion, wealth) {
        super(id, name, description, image, x, y, width, height, Entity.COUNTRY)
        this.locationsMap = locationsMap;
        this.religion = religion;
        this.wealth = wealth;
    }
}


Country.POOR = 'poor';
Country.AVERAGE = 'average';
Country.RICH = 'rich';

module.exports = Country;
