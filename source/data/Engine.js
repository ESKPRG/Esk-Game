const Camera = require('./Camera.js');
const Controller = require('./Controller.js');
const EE = require('events');
const Matrix = require('./AdjacencyMatrix.js');

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
        this.refreshRate = refreshRate;
        this.zoom = zoom;
        this.on('key', (event) => this.keyDown(event.direction, event.down));
        this.on('click', (event) => this.onClick(event.clientX, event.clientY));
        this.gameState = {
            scene: "characterMove"
        }
    }

    addCharacter(character) {
        this.gameSpace.addCharacter(character);
        this.camera.addNewComponent(character);
    }

    createLevel(levelWidth, levelHeight, entityList) {
        let entityXSize;
        let entityYSize;
        let xSize = Math.ceil(levelWidth / this.gameSpace.width);
        let ySize = Math.ceil(levelHeight / this.gameSpace.height);

        let matrix = new Matrix(ySize, xSize, [], 1);
        matrix.createMap();

        for (let entity of entityList) {
            entityXSize = Math.ceil(entity.x / this.gameSpace.width);
            entityYSize = Math.ceil(entity.y / this.gameSpace.height);

            matrix.addEntity(entityXSize, entityYSize, entity)
        }

        return matrix;
    }

    addLevel(width, height, entityList) {
        let level = this.createLevel(width, height, entityList);
        this.gameSpace.setLevel(level);
    }

    keyDown(direction, down) {
        this.gameSpace.keyDown(direction, down);
        this.updateGame()
    }

    updateGame() {
        if (this.gameState.scene === "characterMove") {
            this.gameSpace.update()
        }
        this.camera.updateLocations(this.gameSpace.returnEntityLocations())
        this.camera.updateGame()
    }


    onClick(x, y) {
        switch(this.gameState.scene) {
            case 'characterMove': this.gameSpace.whatDidPlayerClick(x, y);
        }
    }

    start() {
        setInterval(() => {
            this.updateGame()
        }, this.refreshRate)
    }
}

module.exports = Engine;