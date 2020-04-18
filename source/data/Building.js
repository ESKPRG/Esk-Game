const Plane = require('./Plane.js');


class Building extends Plane {
    constructor(name, description, image, x, y, width, height, planeSpace, door, npc, state, level, upgradePlan) {
        super(name, description, image, x, y, width, height, planeSpace);
        this.door = door;
        this.npc = npc;
        this.state = state;
        this.level = level;
        this.upgradePlan = upgradePlan;
        this.insideImage = insideImage;
    }
    

    retrieveBuildingLocation() {
        let dict = {};
        dict[this.name] = [this.x, this.y, this.width, this.height];
        return dict;
    }

    retrieveNpc() {
        return this.npc;
    }

    open() {
        this.state = Building.OPEN;
    }

    
}

Building.OPEN = 'Active'
Building.CLOSED = 'Inactive'

module.exports = Building