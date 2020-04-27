const Component = require('./Component.js');

class CharacterComponent extends Component {
    constructor(id, x, y, layer, width, height, type, color, back, left, right, backLeft, backRight, frontLeft, frontRight) {
        super(id, x, y, layer, width, height, type, color, Component.CHARACTER)
        this.back = back;
        this.left = left;
        this.right = right;
        this.backLeft = backLeft;
        this.backRight = backRight;
        this.frontLeft = frontLeft;
        this.frontRight = frontRight;
    }

    
    static create(character) {
        return new CharacterComponent(
            character.id,
            character.x,
            character.y,
            1,
            character.width,
            character.height,
            Component.IMAGE,
            character.image,
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        )
    }
}

module.exports = CharacterComponent;