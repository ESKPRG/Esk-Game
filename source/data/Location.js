const Entity = require('./Entity.js');

class Location extends Entity {
    constructor(id, name, description, image, x, y, width, height, locationsMap) {
        super(id, name, description, image, x, y, width, height, Entity.LOCATION);
        this.locationsMap = locationsMap
    }
}

module.exports = Location;