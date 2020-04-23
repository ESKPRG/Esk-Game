const Props = require('./Props.js');
const Stats = require('./Stats.js');
const State = require('./State.js');
const Inventory = require('./Inventory.js');

class Door extends Props {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount);
        this.locked = false;
    }

    static create(id) {
        return new Door(
            id,
            "Door",
            "A wooden door",
            "",
            0, 0,
            0, 0,
            Stats.create(
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1
            ),
            new State(
                100,
                0,
                50,
                0
            ),
            new Inventory(),
            100,
            200,
            null
        )
    }
}

module.exports = Door;