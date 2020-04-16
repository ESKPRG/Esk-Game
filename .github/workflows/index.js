const Engine = require('./Main.js');
const World = require('./World.js')


const engine = new Engine(new World(
    0.8,
    0.2,
    null,
    1600,
    900
))

engine.start();


