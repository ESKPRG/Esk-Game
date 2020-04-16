class Canvas {
    constructor(parentNode, layer) {
        this.canvas = document.createElement('canvas');
        this.component = null;
        this.layer = layer;
        this.parentNode = parentNode;
    }

    setEventTarget(gm) {
        this.eventTarget = gm;
    }

    emitEvent(event) {
        if (this.eventTarget) {
            this.eventTarget.emit(event);
        }
    }

    start() {
        this.canvas.width = 1600;
        this.canvas.height = 900;
        this.canvas.setAttribute('class', 'layer')
        this.canvas.setAttribute('z-index', this.layer)
        this.context = this.canvas.getContext("2d");
        this.parentNode.appendChild(this.canvas)
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    draw() {
        this.component.drawImage(this.context);
    }


    set(component) {
        this.component = component;
    }

    get() {
        return this.component;
    }
}

module.exports = Canvas;