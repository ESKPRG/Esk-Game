const cc = require('./characterComponent.js');
const component = require('./component.js');

class GoblinComponent extends cc {
    constructor(id, x, y) {
        super(id, x, y, 'assets/goblin-1.png', 300, 300, component.IMAGE)
    }

    attack() {
        this.color = 'assets/goblin-1-attack.png';
    }

    basic() {
        this.color = 'assets/goblin-1.png';
    }

    hit() {
        this.color = 'assets/goblin-1-hit.png'
    }

}

module.exports = GoblinComponent;