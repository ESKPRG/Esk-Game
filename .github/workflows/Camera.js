const Canvas = require('./Canvas.js');
const Component = require('./Component.js');

class Camera {
    constructor(destination) {
        this.canvasList = [];
        this.destination = destination;
    }

    block() {
        this.addNewComponent(Component.block())
    }

    background() {
        this.addNewComponent(Component.background())
    }

    createNewLayer(layer) {
        let canvas = new Canvas(this.destination, layer);
        canvas.start();
        this.canvasList.push(canvas);
        return canvas;
    }

    addNewComponent(component) {
        let canvas = this.createNewLayer(component.layer);
        canvas.set(component);
    }

    updateLocations(locationObject) {
        for (let canvas of this.canvasList) {
            if (canvas.layer === 1) {
                canvas.component.update(locationObject);
            }
        }
    }

    clear() {
        for (let canvas of this.canvasList) {
            canvas.clear();
        }
    }

    update() {
        for (let canvas of this.canvasList) {
            canvas.draw();
        }
    }

    updateGame() {
        this.clear();
        this.update();
    }
}

module.exports = Camera;