const Building = require('./Building.js')

class Armoury extends Building {
    constructor(upgrade, state, blacksmith, forge, anvil, x, y) {
        super('blacksmith',upgrade, state, blacksmith, x, y)
        this.forge = forge
        this.anvil = anvil
    }

    anvilUpgrade() {
        this.anvil.levelUp()
    }

    forgeUpgrade() {
        this.forge.levelUp()
    }

    cheaperPrices(amount) {
        this.blacksmith.cheaperPrices(amount)
    
    }

    cheaperRepair(amount) {
        this.blacksmith.cheaperRepair(amount)
    }

    anvilQualityUp(quality) {
        this.anvil.qualityUp(quality)
    }

    forgeQualityUp(quality) {
        this.forge.qualityUp(quality)
    }
}

module.exports = Armoury