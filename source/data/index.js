const Engine = require('./Engine.js');
const GameState = require('./GameSpace.js');
const Earth = require('./Earth.js')
const DemiGod = require('./DemiGod.js');
const Icon = require('./Icon.js');

const earth = Earth.create(); //create the world

const engine = new Engine(
    new GameState(
        0.8,
        earth, //pass in the world
        document.body.clientHeight,
        document.body.clientWidth
    ),
    20, //framerate
    1
)

const scene1 = [
    "MainScreen", 
    document.body.clientWidth, 
    document.body.clientHeight, 
    [
        Icon.startButton(engine.gameSpace.width / 2, engine.gameSpace.height / 2, 450, 200, 'Start Game')
    ], 
    () => { 
        engine.mainScreen() 
    }
]

const scene2 = [
    "Intro", //name
    3000, //width
    1500, //height
    [   
        DemiGod.create("bad", 1000, 500), //entities
        DemiGod.create("ygit", 500, 500),
        DemiGod.create("Hazar", 100, 100)
    ], 
    () => { 
        engine.openWorld() //function to play
    }
]

scene3 = [
    "Second chapter", 
    3000, 
    1500, 
    [
        DemiGod.create("yuh", 1000, 500)
    ], 
    ()=>{}
]

scene4 = [
    "Third Chapter", 
    6000, 
    2000, 
    [
        DemiGod.create("yeah", 500, 500)
    ], 
    ()=>{}
]

let game = [
    scene1,
    scene2,
    scene3,
    scene4
]

engine.prepareGame(game);

engine.start();

