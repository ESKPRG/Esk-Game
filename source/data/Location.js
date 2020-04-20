const Entity = require('./Entity.js');

class Location extends Entity {
    constructor(name, description, image, x, y, width, height, locationsMap) {
        super(name, description, image, x, y, width, height, Entity.LOCATION);
        this.locationsMap = locationsMap
    }
}

module.exports = Location;