const Building = require('./Building.js')
const Door = require('./Door.js')
const Blacksmith = require('./Blacksmith.js')
const Forge = require('./Forge.js');
const Anvil = require('./Anvil.js');
const ArmouryUpgradePlan = require('./ArmouryUpgradePlan.js');

class Armoury extends Building {
    constructor(name, description, image, x, y, width, height, planeSpace, door, npc, state, level, upgradePlan, insideImage) {
        super(name, description, image, x, y, width, height, planeSpace, door, npc, state, level, upgradePlan, insideImage);

    }

    base(x, y) {
        const ArmouryUpgrade = new ArmouryUpgradePlan()
        ArmouryUpgrade.prepare();

        return new Armoury(
            "Armoury",
            "An armoury",
            '',
            x, y,
            400, 300,
            [
                new Forge(),
                new Anvil()
            ],
            new Door(),
            Blacksmith.create(),
            Building.CLOSED,
            1,
            ArmouryUpgrade,
            ""
        )
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