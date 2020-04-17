const Npc = require('./Npc.js')
const Stats = require('./stats.js')
const Attack = require('./attack.js');
const Defense = require('./defense.js');
const Health = require('./health.js');
const Intelligence = require('./intelligence.js');
const Speed = require('./speed.js');
const Experience = require('./experience.js');
const Inventory = require('./inventory.js');

class Atrius extends Npc {
    constructor() {
        super("Atrius", "The God of War", new Stats(
            new Attack(1),
            new Defense(1),
            new Health(100),
            new Intelligence(1, 0),
            new Speed(1),
            new Experience()
        ),
        new Inventory(),
        Npc.GOD,
        0)
        this.currentBlessing = null;
    }

    blessing() {

    }

    warAction(amount) {
        amount = Math.floor(amount * 1.5)
        this.positive(amount)
    }

    peaceAction(amount) {
        amount = Math.floor(amount * 1.25)
        this.negative(amount)
    }

    loveAction(amount) {
        this.positive(amount)
    }

    labourAction(amount) {
        amount = Math.floor(amount * 0.5)
        this.negative(amount)
    }

    greedAction(amount) {

    }

}

module.exports = Atrius