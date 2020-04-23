const Interactable = require('./Interactable.js');

class Item extends Interactable {
    constructor(id, name, description, image, x, y, width, height, stats,state, inventory, endurance, itemType, rarity, price, level) {
        super(id, name, description, image, x, y, width, height, Interactable.ITEM, stats, state, inventory, endurance);
        this.itemType = itemType;
        this.rarity = rarity;
        this.price = price;
        this.level = level;
    }

}

Item.COMMON = 'common';
Item.RARE = 'rare';
Item.UNCOMMON = 'uncommon';
Item.LEGENDARY = 'legendary';
Item.SERAPH = 'seraph';

module.exports = Item;