const WorshipSpot = require('./WorshipSpot.js')

class PeaceSanctuary extends WorshipSpot {
    constructor(god, level) {
        super(god, WorshipSpot.PEACE, level)
    }
}

module.exports = PeaceSanctuary