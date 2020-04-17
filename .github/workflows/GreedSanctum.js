const WorshipSpot = require('./WorshipSpot.js')

class GreedSanctum extends WorshipSpot {
    constructor(god, level) {
        super(god, WorshipSpot.GREED, level)
    }
}

module.exports = GreedSanctum