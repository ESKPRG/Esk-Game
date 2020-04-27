const Person = require('./Person.js');

class Character extends Person {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, controllable, characterClass) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Person.CHARACTER, controllable);
        this.characterClass = characterClass;
    }
}

Character.DEMIGOD = 'demigod';



module.exports = Character;