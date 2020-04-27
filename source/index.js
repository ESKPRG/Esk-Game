const Engine = require('./engine/Engine.js');
const GameSpace = require('./engine/GameSpace.js');
const Earth = require('./data/Earth.js')
const Icon = require('./data/Icon.js');
const IGF = require('./engine/IsotopeGameFunctions.js');


const earth = Earth.create(); //create the world
console.log(earth)

const engine = new Engine(
    new GameSpace(
        0.8,
        earth, //pass in the world
        document.body.clientWidth,
        document.body.clientHeight,
        new IGF()
    ),
    100, //framerate
    1
)

const scene1 = [
    "MainScreen", //scene name
    [ //scene entityList;
        Icon.mainMenu(engine.gameSpace.screen.width / 2, engine.gameSpace.screen.height / 2, engine.gameSpace.screen.width / 2, engine.gameSpace.screen.height / 2),
        Icon.startButton(engine.gameSpace.screen.width / 2, engine.gameSpace.screen.height / 2, 450, 200, 'Start Game')
    ], 
    () => { //scene start function
        engine.mainScreen() 
    }
]

const scene2 = [
    "Intro", //name  
        earth.countryList[0].locationsMap["School District"], //map
    () => { 
        engine.openWorld() //function to play
    }
]



let game = [
    scene1,
    scene2
]

engine.prepareGame(game);


engine.start();

