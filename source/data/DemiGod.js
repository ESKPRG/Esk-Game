const Character = require('./Character.js');
const Stats = require('./Stats.js');
const State = require('./State.js');
const Inventory = require('./Inventory.js');
const Person = require('./Person.js');
const Body = require('./Body.js')

class DemiGod extends Character {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance) {
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Character.DEMIGOD);
    }

    static create(name) {
        return new DemiGod(
            name, 
            "A demi-God hero",
            "",
            0, 0,
            100,
            250,
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
            Person.GOOD
        )
    }
}

module.exports = DemiGod;