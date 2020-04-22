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
        console.log(level)
        return new Scene(name, this.createLevel(levelWidth, levelHeight, level), func)
    }

    addScene(scene) {
        this.gameState.sceneHandler.addScene(scene);
    }

    prepareGame(game) {
        let list = []
        for (let scene of game) {
            console.log(scene[4])
            list.push(this.createScene(scene[0], scene[1], scene[2], scene[3], scene[4])) //name, width, height, list, func
        }
        this.addScene(this.gameState.sceneHandler.joinScenes(list))
    }

    

    keyDown(direction, down) {
        this.gameSpace.keyDown(direction, down);
        this.updateGame()
    }

    updateGame() {
        // if (this.gameState.scene === "openWorld") {
        //     this.gameSpace.update()
        // }
        this.gameSpace.update(this.gameState.sceneHandler.getLevel());
        this.camera.updateLocations(this.gameSpace.returnEntityLocations())
        this.camera.updateGame()
    }


    onClick(x, y) {
        switch(this.gameState.scene) {
            case 'openWorld': this.gameSpace.whatDidPlayerClick(x, y); break;
            case 'mainScreen': this.gameSpace.clickMainScreen(x, y);
        }
    }

    nextScene() {
        this.gameState.sceneHandler.nextScene();
    }

    start() {
        setInterval(() => {
            this.updateGame()
        }, this.refreshRate)
        this.gameState.sceneHandler.runScene();
    }

    mainScreen() {
        this.gameState.scene = 'mainScreen';
        console.log(this.gameState.scene)
        // this.addCharacter(Icon.startButton(this.gameSpace.width / 2, this.gameSpace.height / 2, 450, 200, 'Start Game'));
    }

    openWorld() {
        this.gameState.scene = 'openWorld';
    }
}

module.exports = Engine;