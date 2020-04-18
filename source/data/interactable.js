const Entity = require('./Entity.js')

class Interactable extends Entity {
    constructor(name, description, image, x, y, width, height, interactableType, stats, state, inventory, endurance) {
        super(name, description, image, x, y, width, height, Entity.INTERACTABLE)
        this.interactableType = interactableType;
        this.stats = stats;
        this.state = state;
        this.inventory = inventory;
        this.endurance = endurance;
        this.use = function(user) {
            console.log(user, "Used")
        }
    }
}

Interactable.USABLE = 'usable';
Interactable.NPC = 'npc';

module.exports = Interactable;                                     