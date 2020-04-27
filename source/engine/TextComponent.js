const Component = require('./Component.js');

class TextComponent extends Component {
    constructor(id, x, y, layer, width, height, type, color, text, font, fillStyle, textAlign) {
        super(id, x, y, layer, width, height, type, color);
        this.text = text;
        this.font = font;
        this.fillStyle = fillStyle;
        this.textAlign = textAlign;
    }

    static text(object) {
        return new TextComponent(
            object.id, object.x,
            object.y,
            2,
            object.width,
            object.height,
            Component.BLOCK,
            object.image,
            object.text,
            object.font,
            object.fillStyle,
            object.textAlign
        )
    }
}

module.exports = TextComponent;