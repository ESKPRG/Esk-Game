const Plain = require('./Plain.js');
const Door = require('./Door.js');

class Building extends Plain {
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList) {
        super(id, name, description, image, x, y, width, height, plainSpace);
        this.door = Door.create();
        this.state = state;
        this.level = level;
        this.upgradePlan = upgradePlan;
        this.insideImage = insideImage;
        this.outsideWidth = outsideWidth;
        this.outsideHeight = outsideHeight;
        this.floorList = floorList;
        this.inside = false;
    }
    

    retrieveBuildingLocation() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    open() {
        this.state = Building.OPEN;
    }

    
}

Building.OPEN = 'Active'
Building.CLOSED = 'Inactive'

module.exports = Building