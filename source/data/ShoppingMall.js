const Building = require('./Building.js');
const Shop = require('./Shop.js');
const BuildingFloor = require('./BuildingFloor.js');

class ShoppingMall extends Building {
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList) {
        super(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList)
    }

    static create(plainSpace, name) {
        return new ShoppingMall(
            0,
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

    static greeceMall() {
        return new ShoppingMall(
            0,
            "Greece Shopping Mall",
            "Greece's central Shopping mall",
            "",
            0, 0,
            10000, 8000,
            [
                Shop.create(100, 100),
                Shop.create(600, 100),
                Shop.create(1100, 100),
                Shop.create(1600, 100)
            ],
            Building.OPEN,
            1,
            null,
            "" ,
            2000,
            1000,
            [
                new BuildingFloor(0, "Floor 1", "Mall floor", "", 0, 0, 10000, 8000, [Shop.create(100, 100)], 1)

            ]
        )
    }
}

module.exports = ShoppingMall;