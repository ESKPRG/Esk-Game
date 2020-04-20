const Engine = require('./Engine.js');
const GameState = require('./GameState.js');
const Earth = require('./Earth.js')


const engine = new Engine(
    new GameState(
        0.8,
        Earth.create(),
        document.body.clientHeight,
        document.body.clientWidth
    ),
    20,
    1
)



console.log(engine)

engine.start();

