const Building = require('./Building.js')

class Chapel extends Building {
    constructor(upgrades, state, shrines, blessingTime, priest, x, y) {
        super('chapel', upgrades, state, priest, x, y)
        this.shrines = shrines;
        this.baseBlessingTime = blessingTime;
        this.remainingTime = null
        this.currentBlessing = null
    }

    visit(shrine) {
        this.currentBlessing = this.shrines.visit(shrine)

    }

    advocate(amount) {
        this.shrines.advocate(amount)
    }

    open() {
        this.state = Building.OPEN
        console.log("The Chapel is now open for use")
        this.advocate(25)

    }

    cheaperFee(amount) {
        this.shrines.cheaperFee(amount)
    }

    dayPass(days) {
        let hours = days * 24
        this.remainingTime -= hours
        if (this.remainingTime <= 0) {
            this.remainingTime = 0
            this.currentBlessing = null
        }
    }

    longerBlessing(amount) {
        this.baseBlessingTime += amount
        this.advocate(amount)
    }

}

module.exports = Chapel