const Character = require('./Character.js');
const Stats = require('./Stats.js');
const State = require('./State.js');
const Inventory = require('./Inventory.js');
const Person = require('./Person.js');

class DemiGod extends Character {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, controllable) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Character.DEMIGOD);
    }

    static create(name, x, y) {
        return new DemiGod(
            0,
            name,   
            "DemiGod",
            "assets/Npc-1.png",
            x, y,
            100,
            120,
            Stats.create(
                10, 2,
                10, 1,
                10, 1,
                10, 1,
                10, 1,
                10, 1,
                10, 1,
                10, 1,
                10, 2
            ),
            new State(
                100,
                100,
                60, //kg
                0
            ),
            new Inventory(),
            null,
            null, //new body after change
            Person.GOOD,
            Person.CONTROL
        )
    }
}

module.exports = DemiGod;