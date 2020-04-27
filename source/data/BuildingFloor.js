const Plain = require('./Plain.js');
const Stairs = require('./Stairs.js')

class BuildingFloor extends Plain {
    constructor(id, name, description, image, x, y, width, height, plainSpace, floorLevel) {
        super(id, name, description, image, x, y, width, height, plainSpace);
        this.floorLevel = floorLevel;
        this.stairs = new Stairs();
    }
}

module.exports = BuildingFloor;