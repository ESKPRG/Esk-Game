const Npc = require('./Npc.js')
const Stats = require('./stats.js')
const Attack = require('./attack.js');
const Defense = require('./defense.js');
const Health = require('./health.js');
const Intelligence = require('./intelligence.js');
const Speed = require('./speed.js');
const Experience = require('./experience.js');
const Inventory = require('./inventory.js');

class Aphrodite extends Npc {
    constructor() {
        super("Aphrodite", "The God of Love and Beauty", new Stats(
            new Attack(1),
            new Defense(1),
            new Health(100),
            new Intelligence(1, 0),
            new Speed(1),
            new Experience()
        ),
        new Inventory(),
        Npc.GOD,
        0
        )
        this.blessing = null;
    }

    blessing() {

    }

    warAction(amount) {
        amount = Math.floor(amount * 1.25)
        this.negative(amount)
    }

    peaceAction(amount) {
        amount = Math.floor(amount * 1.25)
        this.positive(amount)
    }

    loveAction(amount) {
        amount = Math.foor(amount * 1.5)
        this.positive(amount)
    }

    labourAction(amount) {

    }

    greedAction(amount) {
        amount = Math.floor(amount * 0.25)
        this.negative(amount)
    }
}

module.exports = Aphrodite