const Attribute = require('./Attribute.js');

class Dexterity extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Dexterity(
            "Dexterity",
            "How fast a person can move, or react to things",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Dexterity;