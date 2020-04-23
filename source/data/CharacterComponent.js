const Component = require('./Component.js');

class CharacterComponent extends Component {
    constructor(id, x, y, layer, color, width, height, type, back, left, right, backLeft, backRight, frontLeft, frontRight) {
        super(id, x, y, layer, color, width, height, type)
        this.back = back;
        this.left = left;
        this.right = right;
        this.backLeft = backLeft;
        this.backRight = backRight;
        this.frontLeft = frontLeft;
        this.frontRight = frontRight;
    }
    
    static demiGod(character) {
        return new CharacterComponent(
            character.id,
            character.x,
            character.y,
            character.id,
            "",
            character.width,
            character.height,
            Component.IMAGE,
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        )
    }

    static brawler(character) {
        return new CharacterComponent(
            character.id,
            character.x,
            character.y,
            character.id,
            "",
            character.width,
            character.height,
            Component.IMAGE,
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