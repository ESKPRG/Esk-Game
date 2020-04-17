const cc = require('./characterComponent.js');
const component = require('./component.js');

class KnightComponent extends cc {
    constructor(id, x, y) {
        super(id, x, y, 'assets/Warrior-2.png', 300, 300, component.IMAGE)
    }

    attack() {
        this.color = 'assets/Warrior-2-attack.png';

    }

    basic() {
        this.color = 'assets/Warrior-2.png';
    }

    hit() {
        this.color = 'assets/Warrior-2-hit.png';
    }

}

module.exports = KnightComponent;