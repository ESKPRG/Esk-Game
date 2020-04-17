const cc = require('./characterComponent.js');
const component = require('./component.js');

class BlacksmithComponent extends cc {
    constructor(id, x, y) {
        super(id, x, y, 'assets/Blacksmith-1.png', 600, 530, component.IMAGE)
    }

    attack() {
        this.color = 'assets/goblin-2.png';
    }

    basic() {
        this.color = 'assets/goblin-2.png';
    }

}

module.exports = BlacksmithComponent;