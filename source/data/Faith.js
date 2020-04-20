const Attribute = require('./Attribute.js');

class Faith extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Faith(
            "Faith",
            "How well a person carry things, or hit things",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Faith;