const Equipable = require('./Equipable.js');
const Stats = require('./Stats.js');
const State = require('./State.js');
const NoInventory = require('./NoInventory.js');

class Weapon extends Equipable {
    constructor(id, name, description, image, stats, state, inventory, endurance, rarity, price, level, slot, damage, accuracy, reach) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, rarity, price, level, slot, Equipable.WEAPON);
        this.damage = damage;
        this.accuracy = accuracy;
        this.reach = reach;
    }

    static sword() {
        return new Weapon(
            "Sword",
            "A regular sword",
            "",
            Stats.create(
                2, 2,
                1, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1
            ),
            new State(
                50,
                0,
                3 //3 kg
            ),
            new NoInventory(),
            100,
            Item.COMMON,
            5,
            1,
            "RHand",
            10,
            10,
            30
        )
    }
}

module.exports = Weapon;