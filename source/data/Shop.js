const Building = require('./Building.js')
const ShopKeeper = require('./ShopKeeper.js')
const ShopUpgradePlan = require('./ShopUpgradePlan.js')

class Shop extends Building {
    constructor(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        super(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage);
    }

    static create() {
        let plan = new ShopUpgradePlan();
        plan.prepare();

        return new Shop(
            "Shop",
            "A shop",
            "",
            0, 0,
            400, 300,
            [
                ShopKeeper.create(0, 0)
            ],
            Building.CLOSED,
            1,
            plan,
            ""
        )
    }
}

module.exports = Shop