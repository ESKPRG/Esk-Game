const character = require('./character.js');
const stats = require('./stats.js');
const inventory = require('./inventory.js');
const abilityList = require('./abilityList.js');
const ability = require('./ability.js');
const attack = require('./attack.js');
const defense = require('./defense.js');
const health = require('./health.js');
const intelligence = require('./intelligence.js');
const experience = require('./experience.js');
const fighterAbilities = require('./fighterAbilities.js');
const speed = require('./speed.js');
const status = require('./status.js');


class Goblin extends character {
    constructor(name, description, stats, status, inventory, abilityList) {
        super(name, description, stats, inventory, character.GOBLIN, status, abilityList, character.EVIL)
    }

    static create(name) {
        return new Goblin(
            name,
            "A Goblin stinking of Evil and Greed. Truly a pitiful creature.",
            new stats(
                new attack(5),
                new defense(5),
                new health(15),
                new intelligence(1, 0),
                new speed(9),
                new experience()
            ),
            new status(),
            new inventory(),
            new abilityList([
                fighterAbilities.createBash()
            ])
        )
    }
}

module.exports = Goblin;