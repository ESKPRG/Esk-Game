class IsotopeGameFunctions {
    constructor() {
        this.screenX = 0;
        this.screenY = 0;
        this.clickX = null;
        this.clickY = null;
    }

    mouseDown(x, y) {
        this.clickX = x;
        this.clickY = y;
    }

    mouseUp(x, y) {
        let box;
        if (this.clickX && this.clickY) {
            box = { //creating a box
                x: (Math.sign(this.clickX - x) ? x : this.clickX),
                y: (Math.sign(this.clickY - y) ? y : this.clickY),
                width: Math.abs(this.clickX - x),
                height: Math.abs(this.clickY - y)
            }
        }

        this.clickX = null;
        this.clickY = null;

        return box
    }

    keyDown(direction, down) {
        switch (direction) {
            case 'up': this.up(down); break;
            case 'down': this.down(down); break;
            case 'left': this.left(down); break;
            case 'right': this.right(down);
        }

    }

    left(down) { (down) ? this.screenX = 20 : this.screenX = 0; }
    right(down) { (down) ? this.screenX = -20 : this.screenX = 0; }
    up(down) { (down) ? this.screenY = 20 : this.screenY = 0; }
    down(down) { (down) ? this.screenY = -20 : this.screenY = 0; }

    screenMove(screen, map) {
        screen.x += this.screenX;
        screen.y += this.screenY;

        for (let entity of screen.entityList) {
            entity.x += this.screenX;
            entity.y += this.screenY;
        }
        return this.entityListCheck(screen, map);
    }

    entityListCheck(screen, map) {
        let entityList = [];
        for (let entity of map.entityList) { //check which entities are inside the screen and isn't
            if (this.isInside(entity, screen)) {
                entityList.push(entity);
            }
        }
        return entityList;
    }

    isInside(object1, object2) {
        let object1Right = object1.x + object1.width;
        let object1Left = object1.x;
        let object1Top = object1.y;
        let object1Bottom = object1.y + object1.height;

        let object2Right = object2.x + object2.width;
        let object2Left = object2.x;
        let object2Top = object2.y;
        let object2Bottom = object2.y + object2.height;
        // if (object1.x < object2.x && object1.x + object1.width > object2.x && ((object1.y < object2.y && object1.y + object1.height > object2.y) || (object1.y + object1.height > object2.y + object2.height && object1.y < object2.y + object2.height))) {
        //     return true;
        // } else if (object1.x + object1.width > object2.x && object1.x < object2.x && ((object1.y < object2.y && object1.y + object1.height > object2.y) || (object1.y + object1.height > object2.y + object2.height && object1.y < object2.y + object2.height))) {
        //     return true;
        // } else {
        //     console.log("you dumb");
        //     return false;
        // }

        return !(object1Right < object2Left ||
            object1Left > object2Right ||
            object1Bottom < object2Top ||
            object1Top > object2Bottom)
    }

    clickMove(object, x, y, box) {
        if (object instanceof Array) { //since we selected more than one entity in a box
            let origX = x + box.width / 2; //entities need to walk to the position they were in the box
            let origY = y + box.height / 2;
            for (let entity of object) {
                x = origX + (entity.x - origX);
                y = origY + (entity.y - origY);
                entity.currentSteps = 1;
                entity.start = {
                    x: object.x,
                    y: object.y
                };
                x -= entity.width / 2;
                y -= entity.height / 2;
                entity.steps = Math.floor(Math.sqrt(Math.pow(Math.abs(x - entity.x), 2) + Math.pow(Math.abs(y - entity.y), 2))) / 25;
                entity.steps = (!entity.steps) ? 0.1 : entity.steps;
                //find the distance (vector line equation);

                entity.moving = true;
                entity.direction = {
                    x: (x - entity.x) / entity.steps,
                    y: (y - entity.y) / entity.steps
                };
            }
        } else {
            object.currentSteps = 1;
            object.start = {
                x: object.x,
                y: object.y
            };
            x -= object.width / 2;
            y -= object.height / 2;
            object.steps = Math.floor(Math.sqrt(Math.pow(Math.abs(x - object.x), 2) + Math.pow(Math.abs(y - object.y), 2))) / 25;
            object.steps = (!object.steps) ? 0.1 : object.steps;
            //find the distance (vector line equation);

            object.moving = true;
            object.direction = {
                x: (x - object.x) / object.steps,
                y: (y - object.y) / object.steps
            };
        }
    }

    entityListPositionUpdate(entityList) {
        for (let entity of entityList) {
            if (entity.moving) {
                entity.x = entity.start.x + entity.direction.x * entity.currentSteps;
                entity.y = entity.start.y + entity.direction.y * entity.currentSteps;
                if (entity.currentSteps < entity.steps) {
                    entity.currentSteps += 1;
                } else {
                    entity.moving = false;
                    entity.start = {
                        x: null,
                        y: null
                    }
                    entity.direction = {
                        x: null,
                        y: null
                    }
                }
            }
        }
    }
}

module.exports = IsotopeGameFunctions;