const Canvas = require('./Canvas.js');
const Component = require('./Component.js');
const TextComponent = require('./TextComponent.js');

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
            case "Brawler": component = Component.block(entity); break;
            case "startButton": component = TextComponent.text(entity); break;
        }

        let addCheck = true;

        for (let canvas of this.canvasList) {
            if (canvas.layer === component.layer){
                canvas.add(component);
                addCheck = false;
            }
        }

        if (addCheck) {
            let canvas = this.createNewLayer(component.layer);
            canvas.add(component);
        }
    }

    updateCanvasList() {
        for (let canvas of this.canvasList) {
            canvas.canvasList = [];
        }
    }

    updateLocations(locationObject) {
        for (let object of Object.values(locationObject)) {
            let check = false;
            for (let canvas of this.canvasList) {
                if (canvas.layer !== 0) {
                    if (object.id === canvas.layer) {
                        check = true;
                        canvas.update(object)
                    }
                }
            }
            if (!check) {
                this.addNewComponent(object);
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