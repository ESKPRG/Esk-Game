const Component = require('./Component.js');

class userInterface extends Component {
    constructor(x, y, z, img, width, height, type) {
        super(1, x, y, z, img, width, height, type)
    }

    static button(object) {
        let type = object.text ? Component.TEXT : Component.BLOCK;

        return new userInterface(
            object.x,
            object.y,
            object.id,
            object.image,
            object.width,
            object.height,
            type
        )
    }
}

module.exports = userInterface;