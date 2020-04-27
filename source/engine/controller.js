class Controller {
    constructor() {
        document.body.addEventListener('mousedown', (event) => this.emitEvent('mousedown', event));
        document.body.addEventListener('mouseup', (event) => this.emitEvent('mouseup', event));
        document.body.addEventListener('keydown', (event) => this.keyDownUp('keydown', event.keyCode));
        document.body.addEventListener('keyup', (event) => this.keyDownUp('keyup', event.keyCode));
        document.addEventListener('contextmenu', (event) => this.emitEvent('rightclick', event));
    }

    setEventTarget(eventTarget) {
        this.eventTarget = eventTarget;
    }

    emitEvent(event, eventData) {
        if (event === 'rightclick') {
            event.preventDefault(); //don't bring up the settings box;
        };

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
            case 40: this.emitEvent('key', { direction: 'down', down: down}); break;
        }
    }
}

module.exports = Controller;