const Canvas = require('./Canvas.js');
const Component = require('./Component.js');
const TextComponent = require('./TextComponent.js');
const CharacterComponent = require('./CharacterComponent.js');
const BackgroundComponent = require('./BackgroundComponent.js');
const BuildingComponent = require('./BuildingComponent.js');

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
        console.log(entity)
        switch(entity.description) {
            case "DemiGod": component = CharacterComponent.create(entity); break;
            case "Brawler": component = CharacterComponent.create(entity); break;
            case "startButton": component = TextComponent.text(entity); break;
            case "School District": component = BackgroundComponent.schoolDistrict(entity); break;
            case "Greek School": component = (entity.inside) ? BackgroundComponent.greekSchool(entity) : BuildingComponent.greekSchool(entity); break;
            case "mainMenu": component = BackgroundComponent.mainMenu(entity); 
        }

        let addCheck = true;
        for (let canvas of this.canvasList) {
            if (canvas.layer === component.layer){
                canvas.add(component);
                addCheck = false;
            }
        }

        if (addCheck) {
            let newCanvas = this.createNewLayer(component.layer);
            newCanvas.add(component)
        }
    }

    preRender(entityList) {
        for (let entity of entityList) {
            this.addNewComponent(entity);
        }
    }

    updateCanvasList() {
        for (let canvas of this.canvasList) {
            canvas.clear();
            canvas.componentList = [];
        }
    }

    updateLocations(locationObject) {
        for (let object of Object.values(locationObject)) {
            let check = false;
            for (let canvas of this.canvasList) {
                if (canvas.hasThisComponent(object)) {
                    canvas.update(object);
                    check = true;

                }
            }
            if (!check) {
                this.addNewComponent(object);
            }
        }
    }


    update() {
        for (let canvas of this.canvasList) {
                canvas.draw();
        }
    }

    clear() {
        for (let canvas of this.canvasList) {
            canvas.clear();
        }
    }

    updateGame(locationObject) {
        this.updateLocations(locationObject);
    }
}

module.exports = Camera;