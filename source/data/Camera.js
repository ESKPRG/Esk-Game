const Canvas = require('./Canvas.js');
const Component = require('./Component.js');

class Camera {
    constructor(destination) {
        this.canvasList = [];
        this.destination = destination;
        this.onState = false;
    }


    createNewLayer(layer) {
        let canvas = new Canvas(this.destination, layer);
        canvas.start();
        this.canvasList.push(canvas);
        return canvas;
    }

    addNewComponent(entity) {
        let component;
        switch(entity.description) {
            case "DemiGod": component = Component.demiGod(entity); break;
            case "Brawler": component = Component.block(entity);
        }
        let canvas = this.createNewLayer(component.layer);
        canvas.set(component);
    }

    updateLocations(locationObject) {
        for (let object of Object.values(locationObject)) {
            for (let canvas of this.canvasList) {
                if (canvas.layer !== 0) {
                    if (object.id === canvas.layer) {
                        canvas.component.update(object)
                    }
                }
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