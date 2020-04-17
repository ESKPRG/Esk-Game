const interactable = require('./interactable.js');

class Npc extends interactable {
    constructor(name, description, stats, inventory, occupation, favor) {
        super(name, description, interactable.NPC, stats, inventory)
        this.occupation = occupation;
        this.favor = favor;
    }
}

Npc.BLACKSMITH = 'blacksmith';
Npc.DOCTOR = 'doctor';
Npc.SHOPKEEPER = 'shopKeeper';
Npc.PEASENT = 'peasent';
Npc.ADVENTURER = 'adventurer';
Npc.GOD = 'god';

module.exports = Npc;