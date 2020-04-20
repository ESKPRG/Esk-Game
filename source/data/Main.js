const Camera = require('./Camera.js');
const Controller = require('./Controller.js');
const EE = require('events');
const DemiGod = require('./DemiGod.js');
const Brawler = require('./Brawler.js');

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

    addCharacter(character) {
        this.gameSpace.addCharacter(character);
        this.camera.addNewComponent(character);
    }

    keyDown(direction, down) {
        this.gameSpace.keyDown(direction, down);
        this.updateGame()
    }

    updateGame() {
        this.gameSpace.update(this.camera.onState)
        this.camera.updateLocations(this.gameSpace.returnEntityLocations())
        this.camera.updateGame()
    }

    onClick(x, y) {
        this.gameSpace.clickMove(x, y, this.camera.onState);
    }

    start() {
        this.addCharacter(DemiGod.create("d", 600, 900))
        this.addCharacter(DemiGod.create("yigit", 800,
         800))
        this.addCharacter(Brawler.create("f", 500, 500))
        setInterval(() => {
            this.updateGame()
        }, 20)
    }
}

module.exports = Main;