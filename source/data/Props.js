const Usable = require('./Usable.js');

class Props extends Usable {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount)
    }
}

module.exports = Props;