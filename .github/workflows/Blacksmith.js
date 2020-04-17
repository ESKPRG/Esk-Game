const Npc = require('./Npc.js');
const stats = require('./stats.js');
const inventory = require('./inventory.js');
const attack = require('./attack.js');
const defense = require('./defense.js');
const health = require('./health.js');
const intelligence = require('./intelligence.js');
const experience = require('./experience.js');
const speed = require('./speed.js');
const Hammer = require('./Hammer.js')


class Blacksmith extends Npc {
    constructor(name, description, stats, inventory, hammer, favor) {
        super(name, description, stats, inventory, Npc.BLACKSMITH, favor)
        this.hammer = hammer;
    }

    static create() {
        return new Blacksmith(
            "Blacksmith Adrian",
            "The Blacksmith of your town. Don't mess with this guy.",
            new stats(
                new attack(20),
                new defense(25),
                new health(200),
                new intelligence(1, 0),
                new speed(6),
                new experience()
            ),
            new inventory(),
            new Hammer(),
            0
        )
    }
}

module.exports = Blacksmith;