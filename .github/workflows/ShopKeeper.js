const Npc = require('./Npc.js')
const stats = require('./stats.js');
const inventory = require('./inventory.js');
const attack = require('./attack.js');
const defense = require('./defense.js');
const health = require('./health.js');
const intelligence = require('./intelligence.js');
const experience = require('./experience.js');
const speed = require('./speed.js');
const Status = require('./Status.js')
const Body = require('./Body.js')

class ShopKeeper extends Npc {
    constructor(name, description, image, x, y, width, height, stats, inventory, status, body, abilityList, occupation, favor) {
        super(name, description, image, x, y, width, height, stats, inventory, status, body, abilityList, Npc.SHOPKEEPER, 0);
    }

    static create() {
        return new ShopKeeper(
            "Shop keeper steve",
            "The one guy that'll sell you anything",
            "assets/ShopKeeper-1.png",
            1000, 400,
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
            new status(),
            new Body(),
            new abilityList(),
            Npc.SHOPKEEPER,
            0
        )
    }
}

module.exports = ShopKeeper