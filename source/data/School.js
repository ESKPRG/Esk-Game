const Building = require('./Building.js');

class School extends Building {
    constructor(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        super(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage)
    }

    static create(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        return new School(
            name, description,
            image, x, y,
            width, height,
            plainSpace,
            state, level,
            upgradePlan,
            insideImage
        )
    }

    static greekSchool() {
        return new School(
            "Greek school",
            "School in the greek faction of earth",
            "",
            0, 0,
            0, 0,
            [],
            Building.OPEN,
            1,
            null,
            "" //the image of inside the building
        )
    }
}

module.exports = School;