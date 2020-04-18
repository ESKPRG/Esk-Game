const Attribute = require('./Attribute.js');

class Constitution extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Constitution(
            "Constitution",
            "How resiliant a person is to natural or man-made attacks",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Constitution;