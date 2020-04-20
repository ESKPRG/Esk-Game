const Npc = require('./Npc.js')
const stats = require('./stats.js');
const inventory = require('./inventory.js');
const intelligence = require('./intelligence.js');
const experience = require('./experience.js');
const Status = require('./Status.js')
const Body = require('./Body.js')

class ShopKeeper extends Npc {
    constructor(name, description, image, x, y, width, height, stats, inventory, status, body, abilityList, favor) {
        super(name, description, image, x, y, width, height, stats, inventory, status, body, abilityList, Npc.SHOPKEEPER, favor);
    }

    static create(x, y) {
        return new ShopKeeper()
    }
}

module.exports = ShopKeeper