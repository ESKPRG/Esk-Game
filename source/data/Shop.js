const Building = require('./Building.js')
const ShopKeeper = require('./ShopKeeper.js')
const ShopUpgradePlan = require('./ShopUpgradePlan.js')
const Door = require('./Door.js');
const Stand = require('./Stand.js');

class Shop extends Building {
    constructor(name, description, image, x, y, width, height, planeSpace, door, npc, state, level, upgradePlan) {
        super(name, description, image, x, y, width, height, planeSpace, door, npc, state, level, upgradePlan);

    }

    base() {
        plan = new ShopUpgradePlan();
        plan.prepare();

        return new Shop(
            "Shop",
            "A shop",
            "",
            x, y,
            400, 300,
            [

            ],
            new Door(),
            ShopKeeper.create(300, 500),
            Building.CLOSED,
            1,
            plan,
            
        )
    }
    itemPriceCheck(item) {
        return this.basePrices + (item.currentPrice - this.shopKeeper.price())
    }

    buy(item, offeredMoney) {
        if (item.type === 'weapon') {
            item = this.weaponShelf.retrieve(item)
        } else {
            item = this.armorShelf.retrieve(item)
        }
        let price = this.itemPriceCheck(item)
        return this.shopKeeper.sell(item, price, offeredMoney)
    }

    moreGold(amount) {
        this.shopKeeper.higherWage(amount)
    }

    cheaperPrices(amount) {
        this.basePrices -= amount
    }

    moreStocks(amount) {
        this.weaponShelf.moreStocks(amount)
        this.armorShelf.moreStocks(amount)
    }
}

module.exports = Shop