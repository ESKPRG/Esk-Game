const Person = require('./Person.js');

class Npc extends Person {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance){
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Person.NPC)
    }

    
}

module.exports = Npc;