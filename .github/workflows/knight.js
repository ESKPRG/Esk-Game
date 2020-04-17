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
const samuraiAbilities = require('./samuraiAbilities.js')
const speed = require('./speed.js');
const status = require('./Status.js');
const Body = require('./Body.js')


class Knight extends character {
    constructor(name, description, image, x, y, width, height, stats, inventory, status, body, abilityList) {
        super(name, description, image, x, y, width, height, stats, inventory, status, body, abilityList, character.GOOD)
    }

    static create(name) {
        return new Knight(
            name,
            "A Knight from the reaches of Valhara",
            'assets/Warrior-2.png',
            null,
            null,
            200,
            200,
            new stats(
                new attack(10),
                new defense(5),
                new health(100),
                new intelligence(5, 10),
                new speed(10),
                new experience()
            ),
            new inventory(),
            new status(),
            new Body(),
            new abilityList([
                fighterAbilities.createBash(),
                samuraiAbilities.createSlash()
            ])
        )
    }
}

module.exports = Knight;