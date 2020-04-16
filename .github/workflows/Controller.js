class Controller {
    constructor() {
        document.body.addEventListener('click', (event) => this.emitEvent('click', event));
        document.body.addEventListener('keydown', (event) => this.keyDownUp('keydown', event.keyCode));
        document.body.addEventListener('keyup', (event) => this.keyDownUp('keyup', event.keyCode));
    }

    setEventTarget(eventTarget) {
        this.eventTarget = eventTarget;
    }

    emitEvent(event, eventData) {
        if (this.eventTarget) {
            this.eventTarget.emit(event, eventData);
        }
    }

    keyDownUp(type, keyCode) {
        let down = (type == "keydown") ? true : false;

        switch(keyCode) {
            case 37: this.emitEvent('key', { direction: 'left', down: down}); break;
            case 38: this.emitEvent('key', { direction: 'up', down: down}); break;
            case 39: this.emitEvent('key', { direction: 'right', down: down}); break;
            case 40: this.emitEvent('key', { direction: 'down', down: down});
        }
    }
}

module.exports = Controller;