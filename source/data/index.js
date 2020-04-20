const Engine = require('./Main.js');
const World = require('./World.js')


const engine = new Engine(
    new World(
    0.8,
    0.8,
    null,
    document.body.clientHeight,
    document.body.clientWidth
))

engine.start();

