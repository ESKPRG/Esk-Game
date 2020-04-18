const Usable = require('./Usable.js');
const Stats = require('./Stats.js');
const Attack = require('./Attack.js');
const Defense = require('./')

class Appliances extends Usable {
    constructor(name, description, image, x, y, width, height, inventory, endurance, useTime, useAmount) {
        super(name, description, image, x, y, width, height, new Stats(

        ), inventory, endurance, useTime, useAmount)
    }
}

module.exports = Appliances;