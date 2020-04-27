const Camera = require('./Camera.js');
const Controller = require('./Controller.js');
const EE = require('events');
const SceneHandler = require('./SceneHandler.js');
const Scene = require('./Scene.js');

let divGameScreen = document.createElement('div');
divGameScreen.setAttribute('id', 'mainBox')
document.body.appendChild(divGameScreen)


class Engine extends EE {
    constructor(gameSpace, refreshRate, zoom) {
        super()
        this.camera = new Camera(divGameScreen)
        this.controller = new Controller();
        this.controller.setEventTarget(this);
        this.gameSpace = gameSpace;
        this.gameSpace.setEventTarget(this);
        this.refreshRate = refreshRate;
        this.zoom = zoom;
        this.on('key', (event) => this.keyDown(event.direction, event.down));
        this.on('mousedown', (event) => this.mouseDown(event.clientX, event.clientY));
        this.on('mouseup', (event) => this.mouseUp(event.clientX, event.clientY));
        this.on('rightclick', (event) => this.onClick(event.clientX, event.clientY));
        this.on('nextScene', () => this.nextScene());
        this.on('locationChange', (location) => this.locationChange(location));
        this.gameState = {
            scene: "",
            entityCount: 2,
            sceneHandler: new SceneHandler()
        }
    }

    locationChange(location) {
        this.gameSpace.setLocation(location);
    }

    preRender(location) {
        let entityList;
        if (location instanceof Array) { entityList = location; }
        else if (location.plainSpace) { entityList = [...location.plainSpace]; entityList.push(location) }
        else if (location.entityList) { entityList = [...location.entityList]; entityList.push(location) }

        if (entityList) {
            for (let entity of entityList) {
                entity.id = this.gameState.entityCount;
                this.gameState.entityCount += 1;
            }
            this.camera.preRender(entityList);
        } else {
            throw new Error('location not found', location)
        }
    }

    createScene(name, level, func) {
        return new Scene(name, level, func, (level.startPosition) ? level.startPosition: null);
    }

    addScene(scene) {
        this.gameState.sceneHandler.addScene(scene);
    }

    prepareGame(game) {
        let list = []
        for (let scene of game) {
            list.push(this.createScene(scene[0], scene[1], scene[2])); //name, list, background, func
        }
        this.addScene(this.gameState.sceneHandler.joinScenes(list))
    }

    keyDown(direction, down) {
        this.gameSpace.keyDown(direction, down);
    }

    updateGame() {
        this.gameSpace.update(); //update locations
        this.camera.updateGame(this.gameSpace.returnEntityLocations()) //redraw and update components
        this.gameState.sceneHandler.updateScene(this.gameSpace.currentMap.entityList);
    }
    
    onClick(x, y) {
        switch (this.gameState.scene) {
            case 'openWorld': this.gameSpace.whatDidPlayerClick(x, y); break;
            case 'mainScreen': this.gameSpace.clickMainScreen(x, y);
        }
    }

    mouseUp(x, y) {
        switch (this.gameState.scene) {
            case 'openWorld': this.gameSpace.mouseUp(x, y); break;
            case 'mainScreen': this.gameSpace.clickMainScreen(x, y); break
        }
    }

    mouseDown(x, y) {
        switch (this.gameState.scene) {
            case 'openWorld': this.gameSpace.mouseDown(x, y); break;
        }
    }

    nextScene() {
        this.gameState.sceneHandler.nextScene();
        this.gameSpace.setLocation(this.gameState.sceneHandler.getScene().level);
        this.camera.updateCanvasList(); //empty component lists
        this.preRender(this.gameState.sceneHandler.getScene().level)
        this.locationChange(this.gameState.sceneHandler.getScene().level)
    }

    start() {
        setInterval(() => {
            this.updateGame()
        }, this.refreshRate)
        this.gameState.sceneHandler.runScene();
        this.preRender(this.gameState.sceneHandler.getScene().level);
        this.locationChange(this.gameState.sceneHandler.getScene().level)
    }

    mainScreen() {
        this.gameState.scene = 'mainScreen';
        console.log(this.gameState.scene)
    }

    openWorld() {
        this.gameState.scene = 'openWorld';
    }
}

module.exports = Engine;