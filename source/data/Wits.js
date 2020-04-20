const Attribute = require('./Attribute.js');

class Wits extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Wits(
            "Wits",
            "reaction speed",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Wits;