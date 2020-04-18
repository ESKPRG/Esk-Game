const UpgradePlan = require('./UpgradePlan.js')
const UpgradeToken = require('./UpgradeToken.js')
const armoury = require('./Armoury.js')

class ArmouryUpgradePlan extends UpgradePlan {
    constructor() {
        super()
    }

    open() {
        function upgrade(armoury) {
            armoury.open()
        }
        return new UpgradeToken(upgrade,
        "Open Armoury",
        100)
    }

    cheaperPrices() {
        function upgrade(armoury) {
            armoury.cheaperPrices(5)
        }
        return new UpgradeToken(upgrade,
        "cheaper Prices(1)",
        50)
    }

    cheaperPricesTwo() {
        function upgrade(armoury) {
            armoury.cheaperPrices(10)
        }
        return new UpgradeToken(upgrade,
        "cheaper Prices(2)",
        80)
    }

    cheaperRepair() {
        function upgrade(armoury) {
            armoury.cheaperRepair(5)
        }
        return new UpgradeToken(upgrade,
        "Cheaper Repair(1)",
        50)
    }

    anvilUpgrade() {
        function upgrade(armoury) {
            armoury.anvilUpgrade()
        }
        return new UpgradeToken(upgrade,
        "Anvil Upgrade(1)",
        80)
    }

    anvilQualityRare() {
        function upgrade(armoury) {
            armoury.anvilQualityUp('RARE')
        }
        return new UpgradeToken(
            upgrade,
            "Anvil Quality Up(1)",
            500
        )
    }

    forgeQualityRare() {
        function upgrade(armoury) {
            armoury.forgeQualityUp('RARE')
        }
        return new UpgradeToken(
            upgrade,
            "Forge Quality Up(1)",
            400
        )
    }


    forgeUpgrade() {
        function upgrade(armoury) {
            armoury.forgeUpgrade()
        }
        return new UpgradeToken(upgrade,
        "Forge Upgrade(1)",
        80)
    }

    prepare() {
        const one = this.open()
        const two = this.cheaperPrices()
        const three = this.cheaperPricesTwo()
        const four = this.cheaperRepair()
        const five = this.anvilUpgrade()
        const six = this.forgeUpgrade()
        const seven = this.forgeQualityRare()
        const eight = this.anvilQualityRare()

        this.add(one, null)
        this.add(two, one)
        this.add(three, two)
        this.add(four, one)
        this.add(five, three)
        this.add(six, four)
        this.add(eight, five)
        this.add(seven, six)
    }
}

module.exports = ArmouryUpgradePlan