const UpgradePlan = require('./UpgradePlan.js')
const UpgradeToken = require('./UpgradeToken.js')
const tavern = require('./Tavern.js')
const tavernKeeper = require('./TavernKeeper.js')
const Beds = require('./Beds.js')

class TavernUpgradePlan extends UpgradePlan {
    constructor() {
        super()
    }

    open() {
        function upgrade() {
            tavern.open()
        }
        return new UpgradeToken(
            upgrade, 
            "Open the Tavern",
            100
        )
    }

    betterBeds() {
        function upgrade() {
            tavern.betterBeds('commonerBed')
        }
        return new UpgradeToken(
            upgrade,
            "Better Beds",
            150
        )
    }

    betterBedsTwo() {
        function upgrade() {
            tavern.betterBeds('sanctuaryPride')
        }
        return new UpgradeToken(
            upgrade,
            "Even Better Beds",
            500
        )
    }

    cheaperFood() {
        function upgrade() {
            tavern.cheaperFood(5)
        }
        return new UpgradeToken(
            upgrade,
            "Cheaper inn Food",
            200
        )
    }

    cheaperFoodTwo() {
        function upgrade() {
            tavern.cheaperFood(10)
        }
        return new UpgradeToken(
            upgrade,
            "Even cheaper inn Food",
            400
        )
    }

    prepare() {
        const one = this.open()
        const two = this.betterBeds()
        const three = this.betterBedsTwo()
        const four = this.cheaperFood()
        const five = this.cheaperFoodTwo()

        this.add(one, null)
        this.add(two, one)
        this.add(three, two)
        this.add(four, one)
        this.add(five, four)
    }

    
}

module.exports = TavernUpgradePlan