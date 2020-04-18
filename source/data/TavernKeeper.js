const Npc = require('./Npc.js')
const FoodImporter = require('./FoodImporter.js')
const stats = require('./stats.js');
const inventory = require('./inventory.js');
const attack = require('./attack.js');
const defense = require('./defense.js');
const health = require('./health.js');
const intelligence = require('./intelligence.js');
const experience = require('./experience.js');
const speed = require('./speed.js');

class TavernKeeper extends Npc {
    constructor(name, description, stats, inventory, stock) {
        super(name, description, stats, inventory, Npc.TAVERNKEEPER)
        this.stock = stock;
    }

    static create() {
        return new TavernKeeper(
            "Tavern keeper Bryan",
            "Best stocks in all of Tambriel",
            new stats(
                new attack(20),
                new defense(25),
                new health(200),
                new intelligence(1, 0),
                new speed(6),
                new experience()
            ),
            new inventory(),
            new FoodImporter()
        )
    }
}

module.exports = TavernKeeper