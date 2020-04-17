const UpgradePlan = require('./UpgradePlan.js')
const UpgradeToken = require('./UpgradeToken.js')
const chapel = require('./Chapel.js')

class ChapelUpgradePlan extends UpgradePlan {
    constructor() {
        super()
    }

    open() {
        function upgrade() {
            chapel.open()
        }
        return new UpgradeToken(
            upgrade, 
            "Open the Chapel",
            100
        )
    }

    cheaperFee() {
        function upgrade() {
            chapel.cheaperFee(5)
        }
        return new UpgradeToken(
            upgrade,
            "Cheaper Fees(1)",
            50
        )
    }

    cheaperFeeTwo() {
        function upgrade() {
            chapel.cheaperFee(10)
        }
        return new UpgradeToken(
            upgrade,
            "Cheaper Fees(2)",
            80
        )
    }

    longerBlessing() {
        function upgrade() {
            chapel.longerBlessing(6)
        }
        return new UpgradeToken(
            upgrade,
            "Longer Blessing(1)",
            200
        )
    }

    longerBlessingTwo() {
        function upgrade() {
            chapel.longerBlessing(6)
        }
        return new UpgradeToken(
            upgrade,
            "Longer Blessing(2)",
            500
        )
    }
    

    prepare() {
        const one = this.open()
        const two = this.cheaperFee()
        const three = this.cheaperFeeTwo()
        const four = this.longerBlessing()
        const five = this.longerBlessingTwo()

        this.add(one, null)
        this.add(two, one)
        this.add(three, two)
        this.add(four, one)
        this.add(five, four)
    }
}

module.exports = ChapelUpgradePlan