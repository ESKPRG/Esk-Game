const Entity = require('./Entity.js');

class Attribute extends Entity {
    constructor(name, description, image, x, y, width, height, level, multiplier) {
        super(name, description, image, x, y, width, height, Entity.ATTRIBUTE, level, multiplier);
        this.baseLevel = level;
        this.level = level;
        this.multiplier = multiplier;
        this.baseMultiplier = multiplier;
    }
}

module.exports = Attribute;