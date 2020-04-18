const Entity = require('./entity.js')

class Interactable extends Entity {
    constructor(name, description, image, x, y, width, height, interactableType, stats, inventory) {
        super(name, description, image, x, y, width, height, Entity.INTERACTABLE)
        this.interactableType = interactableType;
        this.stats = stats;
        this.inventory = inventory;
    }
}

Interactable.USABLE = 'usable';
Interactable.NPC = 'npc';

module.exports = Interactable;                                     