const Engine = require('./Engine.js');
const GameState = require('./GameSpace.js');
const Earth = require('./Earth.js')
const DemiGod = require('./DemiGod.js');
const Icon = require('./Icon.js');

const earth = Earth.create(); //create the world

const engine = new Engine(
    new GameState(
        0.8,
        earth,
        document.body.clientHeight,
        document.body.clientWidth
    ),
    20,
    1
)

let game = [
    [
        "MainScreen", document.body.clientWidth, document.body.clientHeight, [
            Icon.startButton(engine.gameSpace.width / 2, engine.gameSpace.height / 2, 450, 200, 'Start Game')
        ], () => { engine.mainScreen() }
    ],
    ["Intro", 3000, 1500, [
        DemiGod.create("bad", 1000, 500),
        DemiGod.create("ygit", 500, 500),
        DemiGod.create("Hazar", 100, 100)
    ], () => { engine.openWorld() }],
    ["Second chapter", 3000, 1500, [
        DemiGod.create("yuh", 1000, 500)
    ], ()=>{}],
    ["Third Chapter", 6000, 2000, [
        DemiGod.create("yeah", 500, 500)
    ], ()=>{}]
]

engine.prepareGame(game);

engine.start();

