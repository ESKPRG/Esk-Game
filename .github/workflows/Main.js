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
    }

    keyDown(direction, down) {
        console.log(direction, down);
        this.gameSpace.keyDown(direction, down);
    }

    start() {
        this.camera.background()
        this.camera.block()
    }
}

module.exports = Main;