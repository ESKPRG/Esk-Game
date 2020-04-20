const Attribute = require('./Attribute.js');

class Intelligence extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Intelligence(
            "Intelligence",
            "brains",
            "",
            50, 50,
            level,
            multiplier
        )
    }

}

module.exports = Intelligence;