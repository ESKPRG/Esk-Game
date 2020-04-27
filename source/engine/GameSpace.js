class GameSpace {
    constructor(gravity, world, screenWidth, screenHeight, gameType) {
        this.gravity = gravity;
        this.world = world;
        this.currentLocation = null;
        this.gameType = gameType;
        this.currentMap = {
            width: null,
            height: null,
            entityList: []
        }
        this.screen = {
            selectedEntities: null,
            box: {},
            entityList: [],
            width: screenWidth,
            height: screenHeight,
            x: 0,
            y: 0
        }
    }

    setEventTarget(eventTarget) {
        this.eventTarget = eventTarget;
    }

    emitEvent(event, eventData) {
        if (this.eventTarget) {
            this.eventTarget.emit(event, eventData);
        }
    }

    setLocation(location) {
        if (location instanceof Array) { this.screen.entityList = [...location]; this.currentMap.entityList = [...location]; }
        else if (location.plainSpace) { this.currentLocation = [...location.plainSpace]; this.currentMap.entityList = [...location.plainSpace]; this.currentMap.entityList.push(location); }
        else if (location.entityList) { this.currentLocation = [...location.entityList]; this.currentMap.entityList = [...location.entityList]; this.currentMap.entityList.push(location); }
        //this function sets location and map according to the passed object;
        if (this.currentLocation) { 
            this.currentMap.width = this.currentLocation.width;
            this.currentMap.height = this.currentLocation.height;
        } else {
            this.currentMap.width = this.screen.width;
            this.currentMap.height = this.screen.height;
        }
    }

    collisionCheck(mainObject, object) {
        let check;
        if (mainObject.x < object.x && mainObject.x + mainObject.width > object.x && mainObject.y > object.y && mainObject.y < object.y + object.height) {
            mainObject.x = object.x - mainObject.width;
            check = true;
        } else if (mainObject.x > object.x && mainObject.x < object.x + object.width && mainObject.y > object.y && mainObject.y < object.y + object.height) {
            mainObject.x = object.x + object.width;
            check = true;
        } else if (mainObject.y < object.y && mainObject.y + mainObject.height > object.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + mainObject.height;
            check = true;
        } else if (mainObject.y > object.y && object.y + object.height > mainObject.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + object.height;
            check = true;
        }

        if (check) {
            this.player.moving = false;
        }
    }

    whatDidPlayerClick(x, y) {
        let walkCheck = true;
        for (let entity of this.screen.entityList) {
            if (this.gameType.isInside({
                x: x,
                y: y,
                width: 0,
                height: 0
            }, entity)) {
                //interact with item;
                this.player = entity;
                walkCheck = false;
            }
        }

        if (walkCheck) {
            this.gameType.clickMove(this.screen.selectedEntities, x, y, this.screen.box);
        }
    }

    mouseUp(x, y) {
        this.screen.selectedEntities = [];
        this.screen.box = {};
        x += 52;
        y += 53;
        this.screen.box = this.gameType.mouseUp(x, y);
        for (let entity of this.screen.entityList) {
            if (this.gameType.isInside(entity, this.screen.box)) this.screen.selectedEntities.push(entity); //if entity is inside drawn box, add it to selected entities
        }

        this.screen.box = (this.screen.box.length === 1) ? this.screen.box[1] : this.screen.box; //if the box only has one entity then there is no array 
    }

    mouseDown(x, y) {
        x += 52;
        y += 53;
        this.gameType.mouseDown(x, y);
    }

    clickMainScreen(x, y) {
        x += 225;
        y += 101.5;
        let startButton;
        console.log(this);
        for (let entity of this.screen.entityList) {
            if (entity.name === 'startButton') {
                startButton = entity;
            }
        }

        if (this.gameType.isInside({
            x: x,
            y: y,
            width: 0,
            height: 0
        }, startButton)) {
            this.emitEvent('nextScene');
        }
    }

    returnEntityLocations() {
        let final = {};
        for (let idx = 0; idx < this.screen.entityList.length; idx++) {
            final[idx] = this.screen.entityList[idx];
        }
        return final;
    }

    keyDown(direction, down) {
        this.gameType.keyDown(direction, down);
        if (this.screen.x < 0) { this.screen.x = 0; }
        else if (this.screen.x + this.screen.width > this.currentMap.width) { this.screen.x = this.currentMap.width - this.screen.width; }
        else if (this.screen.y < 0) { this.screen.y = 0; }
        else if (this.screen.y + this.screen.height > this.currentMap.height) { this.screen.y = this.currentMap.height - this.screen.height; }
    }

    update() {
        this.screen.entityList = this.gameType.screenMove(this.screen, this.currentMap); //check screen moving
        this.gameType.entityListPositionUpdate(this.screen.entityList); //update moving entities
    }
}


module.exports = GameSpace;