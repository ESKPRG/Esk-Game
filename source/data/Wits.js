const Attribute = require('./Attribute.js');

class Wits extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }
}

module.exports = Wits;