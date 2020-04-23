const Entity = require('./Entity.js');

class Plain extends Entity {
    constructor(id, name, description, image, x, y, width, height, plainSpace) {
        super(id, name, description, image, x, y, width, height, Entity.PLAIN);
        this.plainSpace = plainSpace;
    }
}

module.exports = Plain;