const Entity = require('./Entity.js');

class Icon extends Entity {
    constructor(name, description, image, x, y, width, height, text, font, fillStyle, textAlign, use) {
        super(name, description, image, x, y, width, height, Entity.ICON)
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

    static blackBox(x, y, width, height) {
        return new Icon(
            "blackBox",
            "",
            "black",
            x, y,
            width, height,
            null,
            null,
            null,
            null,
            () => {
                this.emitEvent(this.text, this)
            }
        )
    }
}

module.exports = Icon;