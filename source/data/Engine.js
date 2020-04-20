const Camera = require('./Camera.js');
const Controller = require('./Controller.js');
const EE = require('events');

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
            scene: "mainScreen"
        }
    }

    addCharacter(character) {
        this.gameSpace.addCharacter(character);
        this.camera.addNewComponent(character);
    }

    keyDown(direction, down) {
        this.gameSpace.keyDown(direction, down);
        this.updateGame()
    }

    updateGame() {
        if (this.gameState.scene === "inGame") {
            this.gameSpace.update()
        }
        this.camera.updateLocations(this.gameSpace.returnEntityLocations())
        this.camera.updateGame()
    }

    onClick(x, y) {
        this.gameSpace.clickMove(x, y);
    }

    start() {
        setInterval(() => {
            this.updateGame()
        }, this.refreshRate)
    }
}

module.exports = Engine;