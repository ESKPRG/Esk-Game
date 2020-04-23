const Entity = require('./Entity.js');

class Icon extends Entity {
    constructor(id, name, description, image, x, y, width, height, text, font, fillStyle, textAlign, use) {
        super(id, name, description, image, x, y, width, height, Entity.ICON)
        this.text = text;
        this.font = font;
        this.fillStyle = fillStyle;
        this.textAlign = textAlign;

        this.use = use;
    }

    setEventTarget(eventTarget) {
        this.eventTarget = eventTarget;
    }

    emitEvent(event, eventData) {
        if (this.eventTarget) {
            this.eventTarget.emit(event, eventData);
        }
    }

    static startButton(x, y, width, height, text) {
        return new Icon(
            1,
            "startButton",
            "startButton",
            "grey",
            x, y,
            width, height, 
            text,
            "80px Arial",
            "white",
            "center",
            () => {
                this.emitEvent(this.text, this);
            }
        )
    }
}

module.exports = Icon;