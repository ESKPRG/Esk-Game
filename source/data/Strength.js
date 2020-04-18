const Attribute = require('./Attribute.js');

class Strength extends Attribute {
    constructor(name, description, image, width, height, level, multipler) {
        super(name, description, image, 0, 0, width, height, level, multipler);
    }

    static create(level, multiplier) {
        return new Strength(
            "Strength",
            "How well a person carry things, or hit things",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Strength;