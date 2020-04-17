const Building = require('./Building.js')

class ExpeditionPost extends Building {
    constructor(upgrades, state, questGiver, exit) {
        super(upgrades, state)
        this.questGiver = questGiver
        this.exit = exit
    }
}

module.exports = ExpeditionPost