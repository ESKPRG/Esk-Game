const Entity = require('./Entity.js');
const Status = require('./Status.js');

class State extends Entity {
    constructor(image, health, stamina, weight, energy) {
        super("State", "Character/object's current state", image, 0, 0, 0, 0); //x, y, width, height all 0 at start, but they can be expanded
        this.status = new Status();
        this.health = health;
        this.healthCap = health;
        this.stamina = stamina;
        this.staminaCap = stamina;
        this.weight = weight;
        this.energy = energy;
    }
}

module.exports = State;