const Building = require('./Building.js');
const BuildingFloor = require('./BuildingFloor.js');

class School extends Building {
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList) {
        super(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList);
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

    static greekSchool() {
        return new School(
            0,
            "Greek School",
            "Greek School",
            "",
            0, 0,
            10000, 6000,
            [],
            Building.OPEN,
            1,
            null,
            "", //the image of inside the building
            5000, 1000,
            [
                new BuildingFloor(0, "Floor 1", "Greek school", "", 0, 0, 10000, 6000, [], 1)
            ]
        )
    }
}

module.exports = School;