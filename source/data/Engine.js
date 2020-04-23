const Camera = require('./Camera.js');
const Controller = require('./Controller.js');
const EE = require('events');
const Matrix = require('./AdjacencyMatrix.js');
const Icon = require('./Icon.js');
const SceneHandler = require('./SceneHandler.js');
const Scene = require('./Scene.js');

let divGameScreen = document.createElement('div');
divGameScreen.setAttribute('id', 'mainBox')
document.body.appendChild(divGameScreen)


class Engine extends EE{
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
        this.on('click', (event) => this.onClick(event.clientX, event.clientY));
        this.on('nextScene', () => this.nextScene())
        this.player = null;
        this.gameState = {
            scene: "",
            entityCount: 1,
            sceneHandler: new SceneHandler()
        }
    }

    addCharacter(character) {
        let add = character;
        add.id = this.gameState.entityCount;
        this.gameSpace.addCharacter(character);
        this.camera.addNewComponent(character);
        this.gameState.entityCount += 1;
    }

    createLevel(levelWidth, levelHeight, entityList) {
        console.log(entityList)
        let entityXSize;
        let entityYSize;
        let xSize = Math.ceil(levelWidth / this.gameSpace.width);
        let ySize = Math.ceil(levelHeight / this.gameSpace.height);

        let matrix = new Matrix(xSize, ySize, [], 1);
        matrix.createMap();

        for (let entity of entityList) {
            entityXSize = Math.ceil(entity.x / this.gameSpace.width);
            entityYSize = Math.ceil(entity.y / this.gameSpace.height);

            matrix.addEntity(entityXSize, entityYSize, entity)
        }

        return matrix;
    }


    createScene(name, levelWidth, levelHeight, level, func) {
        return new Scene(name, this.createLevel(levelWidth, levelHeight, level), func)
    }

    addScene(scene) {
        this.gameState.sceneHandler.addScene(scene);
        console.log(this.gameState.sceneHandler.sceneList)
    }

    prepareGame(game) {
        let list = []
        for (let scene of game) {
            list.push(this.createScene(scene[0], scene[1], scene[2], scene[3], scene[4])) //name, width, height, list, func
        }
        this.addScene(this.gameState.sceneHandler.joinScenes(list))
    }

    

    keyDown(direction, down) {
        this.gameSpace.keyDown(direction, down);
        this.updateGame()
    }

    updateGame() {
        this.gameState.sceneHandler.getLevel().get(this.gameSpace.levelIdx).entityList = this.gameSpace.entityList;
        this.gameSpace.update();
        this.camera.updateLocations(this.gameSpace.returnEntityLocations())
        this.camera.updateGame()
    }



    setLevel(level) {
        this.gameSpace.setLevel(level);
    }


    onClick(x, y) {
        console.log(this.gameState.scene)
        switch(this.gameState.scene) {
            case 'openWorld': this.gameSpace.whatDidPlayerClick(x, y); break;
            case 'mainScreen': this.gameSpace.clickMainScreen(x, y);
        }
    }

    nextScene() {
        this.gameState.sceneHandler.nextScene();
        this.gameSpace.setLevel(this.gameState.sceneHandler.getLevel())
        for (let idx = 1; idx < this.gameSpace.level.matrix.size; idx++) { //add id values as the entity counter goes up
            for (let entity of this.gameSpace.level.get(idx).entityList) {
                entity.id = this.gameState.entityCount;
                console.log(entity)
                this.gameState.entityCount += 1;
            }
        }
        this.gameSpace.setLevel(this.gameState.sceneHandler.getLevel());
        this.camera.updateCanvasList();
    }

    start() {
        setInterval(() => {
            this.updateGame()
        }, this.refreshRate)
        this.gameSpace.setLevel(this.gameState.sceneHandler.getLevel())
        this.gameState.sceneHandler.runScene();
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