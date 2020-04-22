const Engine = require('./Engine.js');
const GameState = require('./GameSpace.js');
const Earth = require('./Earth.js')
const DemiGod = require('./DemiGod.js');
const matrix = require('./AdjacencyMatrix.js');

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

engine.addLevel(3000, 1500, [
    DemiGod.create("bad", 1000, 500)
])

engine.addCharacter(DemiGod.create("Hazar", 100, 100))
engine.addCharacter(DemiGod.create("ygit", 500, 500))



engine.start();

