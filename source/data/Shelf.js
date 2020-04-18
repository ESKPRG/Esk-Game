const Appliances = require('./Appliances.js');
const Stats = require('./Stats.js');
const State = require('./State.js');
const Inventory = require('./Inventory.js')

class Shelf extends Appliances {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
       super(name, description, image, x, y, width, height, stats, inventory, endurance, useTime, useAmount);

    }

    create(x, y) {
        return new Shelf(
            "shelf",
            "To hold stuff",
            "",
            x, y,
            100, 200,
            Stats.create(
                0, 0, //strength
                0, 0, //dex
                10, 0, //endurance
                0, 0, //int
                10, 0, //const
                0, 0, //wits
                0, 0, //??
                0, 0, //luck
                0, 0 //faith
            ),
            new State(
                "",
                100,
                0,
                10
            ),
            new Inventory(),
            100,
            1000, //milli seconds
            null //infinite use amounts
        )
    }
}

module.exports = Shelf