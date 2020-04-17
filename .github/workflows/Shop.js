const Building = require('./Building.js')
const ShopKeeper = require('./ShopKeeper.js')
const ShopUpgradePlan = require('./ShopUpgradePlan.js')

class Shop extends Building {
    constructor(upgrade, state, shopKeeper, weaponShelf, armorShelf, x, y) {
        super('shop', upgrade, state, shopKeeper, x, y)
        this.weaponShelf = weaponShelf
        this.armorShelf = armorShelf
        this.basePrices = 200
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