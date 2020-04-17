const interactable = require('./interactable.js');

class Npc extends interactable {
    constructor(name, description, image, x, y, width, height, stats, inventory, status, body, abilityList, occupation, favor) {
        super(name, description, image, x, y, width, height, interactable.NPC, stats, inventory)
        this.status = status;
        this.body = body;
        this.abilityList = abilityList;
        this.occupation = occupation;
        this.favor = favor;
    }
}

Npc.BLACKSMITH = 'blacksmith';
Npc.DOCTOR = 'doctor';
Npc.SHOPKEEPER = 'shopKeeper';
Npc.PEASENT = 'peasent';
Npc.ADVENTURER = 'adventurer';
Npc.MONSTER = 'monster';
Npc.GOD = 'god';

module.exports = Npc;