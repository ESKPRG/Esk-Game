const Entity = require('./Entity.js');
const Status = require('./Status.js');

class State extends Entity {
    constructor(health, stamina, weight, chi) {
        super("State", "Character/object's current state", "", 0, 0, 0, 0); //x, y, width, height all 0 at start, but they can be expanded
        this.status = new Status();
        this.health = health;
        this.healthCap = health;
        this.stamina = stamina;
        this.staminaCap = stamina;
        this.weight = weight;
        this.chi = chi;
    }
}

module.exports = State;