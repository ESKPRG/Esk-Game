const Building = require('./Building.js')
const TavernUpgradePlan = require('./TavernUpgradePlan')
const TavernKeeper = require('./TavernKeeper')
const Beds = require('./Beds.js')

class Tavern extends Building {
    constructor(upgrade, state, tavernKeeper, beds, x, y) {
        super('tavern', upgrade, state, tavernKeeper, x, y)
        this.beds = beds
    }


    betterBeds(bed) {
        this.beds = Beds[bed]()
    }

    cheaperFood(amount) {
        this.tavernKeeper.cheaperFood(amount)
    }
}

module.exports = Tavern