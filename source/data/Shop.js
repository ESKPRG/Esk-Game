const Building = require('./Building.js')
const ShopKeeper = require('./ShopKeeper.js')
const ShopUpgradePlan = require('./ShopUpgradePlan.js')

class Shop extends Building {
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList) {
        super(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList);
    }

    static create(x, y) {
        let plan = new ShopUpgradePlan();
        plan.prepare();

        return new Shop(
            0,
            "Shop",
            "A shop",
            "",
            x, y,
            400, 300,
            [
                ShopKeeper.create(0, 0)
            ],
            Building.CLOSED,
            1,
            plan,
            "",
            500,
            500,
            []
        )
    }
}

module.exports = Shop