const Attribute = require('./Attribute.js');

class Endurance extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Endurance(
            "Endurance",
            "blah",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Endurance;