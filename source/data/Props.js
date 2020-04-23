const Usable = require('./Usable.js');

class Props extends Usable {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount)
    }
}

module.exports = Props;