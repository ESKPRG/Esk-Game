const Entity = require('./Entity.js');

class Plane extends Entity {
    constructor(name, description, image, x, y, width, height, planeSpace) {
        super(name, description, image, x, y, width, height, Entity.MISCELLANEOUS);
        this.planeSpace = planeSpace;
    }
}

module.exports = Plane;