const Item = require('./Item.js');

class Equipable extends Item {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, rarity, price, level, slot, mainStat, equipableType) {
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, Item.EQUIPABLE, rarity, price, level);
        this.slot = slot;
        this.equipableType = equipableType;
        this.mainStat = mainStat;
    }
}

module.exports = Equipable;