const Engine = require('./Main.js');
const World = require('./World.js')


const engine = new Engine(
    new World(
    0.8,
    0.8,
    null,
    1000,
    2000
))

engine.start();

