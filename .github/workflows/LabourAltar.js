const WorshipSpot = require('./WorshipSpot.js')

class LabourAltar extends WorshipSpot {
    constructor(god, level) {
        super(god, WorshipSpot.LABOUR, level)
    }
}

module.exports = LabourAltar