const Mgs = require('./mainGameScreen.js');
const Gm = require('./gameManager.js')
const World = require('./world.js')
const Clr = require('./controller.js')
const Earth = require('./Earth.js');
const Canvas = require('./canvas.js');


let divGameScreen = document.createElement('div');
divGameScreen.setAttribute('id', 'mainBox')
document.body.appendChild(divGameScreen)

const mainGameScreen = new Mgs(
    new Canvas(divGameScreen, 0),
    new Canvas(divGameScreen, 1),
    new Canvas(divGameScreen, 2)
)

const gameManager = new Gm(
    new World(
        '#000000',
        3,
        Earth.create(),
        1250,
        2000
    ),
    mainGameScreen,
    new Clr(),
)
gameManager.start()


// let keyDownUp = function(event) {
//     controller.keyDownUp(event.type, event.keycode)
// }

// let update = function() {
//     if (controller.left) { gameManager.left(); }
//     if (controller.right) { gameManager.right(); }
//     if (controller.up) { gameManager.jump(); controller.up = false; }

//     gameManager.update();
// }



