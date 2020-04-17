const Npc = require('./Npc.js')
const stats = require('./stats.js');
const inventory = require('./inventory.js');
const attack = require('./attack.js');
const defense = require('./defense.js');
const health = require('./health.js');
const intelligence = require('./intelligence.js');
const experience = require('./experience.js');
const speed = require('./speed.js');

class ShopKeeper extends Npc {
    constructor(name, description, stats, inventory, favor) {
        super(name, description, stats, inventory, Npc.SHOPKEEPER, favor)
    }

    static create() {
        return new ShopKeeper(
            "Shop keeper steve",
            "The one guy that'll sell you anything",
            new stats(
                new attack(20),
                new defense(25),
                new health(200),
                new intelligence(1, 0),
                new speed(6),
                new experience()
            ),
            new inventory(),
            0
        )
    }
}

module.exports = ShopKeeper