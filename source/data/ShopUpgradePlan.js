const UpgradePlan = require('./UpgradePlan.js')
const UpgradeToken = require('./UpgradeToken.js')
const shop = require('./Shop.js')

class ShopUpgradePlan extends UpgradePlan {
    constructor() {
        super()
    }

    cheaperOne() {
        function upgrade() {
            shop.weaponShelf.cheapen(10)
        }
        return new UpgradeToken(upgrade,
        "Cheaper(1)",
        50)
    }

    cheaperTwo() {
        function upgrade() {
            shop.armorShelf.cheapen(20)
        }
        return new UpgradeToken(upgrade,
        "Cheaper(2)",
        60)
    }

    moreGoldOne() {
        function upgrade() {
            shop.moreGold(100)
        }
        return new UpgradeToken(upgrade,
        "More Gold(1)",
        30)
    }

    moreGoldTwo() {
        function upgrade() {
            shop.moreGold(200)
        }
        return new UpgradeToken(upgrade,
        "More Gold(2)",
        50)
    }

    moreStocksOne() {
        function upgrade() {
            shop.weaponShelf.moreStocks(1)
            shop.armorShelf.moreStocks(1)
        }
        return new UpgradeToken(upgrade,
        "Greater Stocks(1)",
        100)
    }

    moreStocksTwo() {
        function upgrade(){
            shop.weaponShelf.moreStocks(2)
            shop.armorShelf.moreStocks(2)
        }
        return new UpgradeToken(upgrade,
        "Greater Stocks(2)",
        200)
    }

    moreStocksThree() {
        function upgrade() {
            shop.weaponShelf.moreStocks(3)
            shop.armorShelf.moreStocks(3)
        }
        return new UpgradeToken(upgrade,
        "Greater Stocks(3)",
        300)
    }

    prepare() {
        const two = this.cheaperOne()
        const three = this.cheaperTwo()
        const four = this.moreGoldOne()
        const five = this.moreGoldTwo()
        const one = this.moreStocksOne()
        const six = this.moreStocksTwo()
        const seven = this.moreStocksThree()

        this.add(one, null)
        this.add(two, one)
        this.add(three, two)
        this.add(four, one)
        this.add(five, four)
        this.add(six, five)
        this.add(seven, three)
    }
}

module.exports = ShopUpgradePlan