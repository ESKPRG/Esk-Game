const WorshipSpot = require('./WorshipSpot.js')

class WarTemple extends WorshipSpot {
    constructor(god, level) {
        super(god, WorshipSpot.WAR, level)
    }
}

module.exports = WarTemple