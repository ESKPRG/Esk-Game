class Canvas {
    constructor(parentNode, layer) {
        this.canvas = document.createElement('canvas');
        this.componentList = [];
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
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.canvas.setAttribute('class', 'layer')
        this.canvas.setAttribute('z-index', this.layer)
        this.context = this.canvas.getContext("2d");
        this.parentNode.appendChild(this.canvas)
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let component of this.componentList) {
            component.drawImage(this.context);
        }
    }

    update(component) {
        for (let value of this.componentList) {
            if (value.id === component.id) {
                if (value.update(component)) { 
                    this.draw();
                }
            }
        }
    }

    hasThisComponent(entity) {
        for (let component of this.componentList) {
            if (component.id == entity.id) return true;
        }
    }

    add(component) {
        this.componentList.push(component);
        component.drawImage(this.context);
    }

    get() {
        return this.componentList;
    }
}

module.exports = Canvas;