const Person = require('./Person.js');

class Character extends Person {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, characterClass) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Person.CHARACTER);
        this.characterClass = characterClass;
    }
}

Character.DEMIGOD = 'demigod';



module.exports = Character;