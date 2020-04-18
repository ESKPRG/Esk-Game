const WorshipSpot = require('./WorshipSpot.js')

class LoveShrine extends WorshipSpot {
    constructor(god, level) {
        super(god, WorshipSpot.LOVE, level)

    }

    advocate(amount) {
        this.god.positive(amount)
    }
}

module.exports = LoveShrine