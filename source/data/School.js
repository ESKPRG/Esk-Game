const Building = require('./Building.js');

class School extends Building {
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        super(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage)
    }

    static create(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        return new School(id,
            name, description,
            image, x, y,
            width, height,
            plainSpace,
            state, level,
            upgradePlan,
            insideImage
        )
    }

    static greekSchool(id) {
        return new School(
            id,
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