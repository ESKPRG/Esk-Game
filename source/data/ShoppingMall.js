const Building = require('./Building.js');
const Door = require

class ShoppingMall extends Building {
    constructor(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        super(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage)
    }

    static create(plainSpace, name) {
        return new ShoppingMall(
            name,
            "", //description
            "", //image
            0, 0,
            0,0,
            plainSpace,
            Building.OPEN,
            1,
            null,
            "" //inside image
        )
    }
}

module.exports = ShoppingMall;