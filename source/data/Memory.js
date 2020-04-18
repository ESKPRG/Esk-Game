const Attribute = require('./Attribute.js');

class Memory extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }
}

module.exports = Memory;