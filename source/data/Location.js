const Entity = require('./Entity.js');

class Location extends Entity {
    constructor(id, name, description, image, x, y, width, height, entityList, startPosition) {
        super(id, name, description, image, x, y, width, height, Entity.LOCATION);
        this.entityList = entityList;
        this.startPosition = startPosition;
    }
}

module.exports = Location;