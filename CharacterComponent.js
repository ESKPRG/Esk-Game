const Component = require('./Component.js');

class characterComponent extends Component {
    constructor(id, x, y, color, width, height, type) {
        super(id, x, y, 2, color, width, height, type)
        this.velocityX = 0;
        this.velocityY = 0;
        this.jump = 16; 
        this.jumping = false;
    }
    

}

module.exports = characterComponent;