const Interactable = require('./Interactable.js');

class Person extends Interactable {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, personType, controllable) {
        super(id, name, description, image, x, y, width, height, Interactable.PERSON, stats, state, inventory, endurance);
        this.body = body;
        this.alliance = alliance;
        this.personType = personType;
        this.controllable = controllable;
    }
}

Person.CHARACTER = 'character';
Person.NPC = 'npc';

Person.GOOD = 'good';
Person.LAWFULGOOD = 'lawfulGood'
Person.EVIL = 'evil';

Person.CONTROL = 'control';
Person.UNCONTROL = 'uncontrol';

module.exports = Person;