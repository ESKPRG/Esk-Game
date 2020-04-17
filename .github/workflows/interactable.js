const Entity = require('./entity.js')

class Interactable extends Entity {
    constructor(name, description, interactableType, stats, inventory) {
        super(name, description, Entity.INTERACTABLE)
        this.interactableType = interactableType;
        this.stats = stats;
        this.inventory = inventory;
    }
}

Interactable.CHEST = 'chest';
Interactable.DOOR = 'door';
Interactable.NPC = 'npc';
module.exports = Interactable;                                     