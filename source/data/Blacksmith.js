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
const Status = require('./Status.js');


class Blacksmith extends Npc {
    constructor(name, description, image, x, y, width, height, stats, inventory, status, body, abilityList, occupation, favor, hammer) {
        super(name, description, image, x, y, width, height, interactable.NPC, stats, inventory, status, body, abilityList, occupation, favor);
        this.hammer = hammer;
    }

    static create() {
        return new Blacksmith(
            "Blacksmith Adrian",
            "The Blacksmith of your town. Don't mess with this guy.",
            "assets/Blacksmith-1.png",
            300, 300,
            300,
            300,
            new stats(
                new attack(20),
                new defense(25),
                new health(200),
                new intelligence(1, 0),
                new speed(6),
                new experience()
            ),
            new inventory(),
            new Status(),
            new Body(),
            new abilityList([]),
            Npc.BLACKSMITH,
            0,
            new Hammer()
        )
    }
}

module.exports = Blacksmith;