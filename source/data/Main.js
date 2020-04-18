const Camera = require('./Camera.js');
const Controller = require('./Controller.js');
const EE = require('events');

let divGameScreen = document.createElement('div');
divGameScreen.setAttribute('id', 'mainBox')
document.body.appendChild(divGameScreen)


class Main extends EE{
    constructor(gameSpace) {
        super()
        this.camera = new Camera(divGameScreen)
        this.controller = new Controller();
        this.controller.setEventTarget(this);
        this.gameSpace = gameSpace;
        this.on('key', (event) => this.keyDown(event.direction, event.down));
        this.on('click', (event) => this.onClick(event.clientX, event.clientY))
    }

    keyDown(direction, down) {
        this.gameSpace.keyDown(direction, down);
        this.updateGame()
    }

    updateGame() {
        this.gameSpace.update()
        this.camera.updateLocations(this.gameSpace.returnEntityLocations())
        this.camera.updateGame()
    }

    onClick(x, y) {
        this.gameSpace.clickMove(x, y);
    }

    start() {
        this.camera.background()
        this.camera.block()
        setInterval(() => {
            this.updateGame()
        }, 20)
    }
}

module.exports = Main;