const Interactable = require('./Interactable.js');

class Usable extends Interactable {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(id, name, description, image, x, y, width, height, Interactable.USABLE, stats, state, inventory, endurance)
        this.useTime = useTime;
        this.useAmount = useAmount;
    }
}

module.exports = Usable;