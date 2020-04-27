const Interactable = require('./Interactable.js');
const NoStats = require('./NoStats.js');
const NoState = require('./NoState.js');
const NoInventory = require('./noInventory.js');

class Stairs extends Interactable {
    constructor(id, name, description, image, x, y, width, height, interactableType, stats, state, inventory, endurance) {
        super(id, name, description, image, x, y, width, height, interactableType, stats, state, inventory, endurance);
        // this.up = ()=>{};
        // this.down() = ()=>{};
    }

    static create() {
        return new Stairs(
            0,
            "Stairs",
            "Stairs",
            "",
            0, 0,
            300, 300,
            Interactable.STAIRS,
            new NoStats(),
            new NoState(),
            new NoInventory(),
            null
        )
    }
}

module.exports = Stairs;