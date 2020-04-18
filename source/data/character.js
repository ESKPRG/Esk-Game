const Person = require('./Person.js');

class Character extends Person {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, characterClass) {
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Person.CHARACTER);
        this.characterClass = characterClass;
    }
}

Character.DEMIGOD = 'demigod';



module.exports = Character;