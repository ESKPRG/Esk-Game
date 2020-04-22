const DemiGod = require('./DemiGod.js');
const Matrix = require('./AdjacencyMatrix.js');

class GameSpace {
    constructor(gravity, world, height, width) {
        this.gravity = gravity;
        this.world = world;
        this.height = height;
        this.width = width;
        this.entityList = []
        this.player = null;
        this.cameraState = false;
        this.moveLocation = null;
        this.level;
        this.levelIdx = 1;
    }

    setEventTarget(eventTarget) {
        this.eventTarget = eventTarget;
    }

    emitEvent(event, eventData) {
        if (this.eventTarget) {
            this.eventTarget.emit(event, eventData);
        }
    }

    setLevel(level) {
        this.level = level;
    }

    addCharacter(character) {
        this.entityList.push(character);
    }

    collideObject(object) {
        let finalIdx;
        for (let idx = 0; idx < this.entityList.length; idx++) { //find idx of object to be removed if it leaves boundaries
            if (this.entityList[idx] === object) {
                finalIdx = idx;
            }
        }

        if (object.x < 0) { 
            object.x = 0; object.velocityX = 0;
            let move = this.level.get(this.levelIdx).left;
            if (move) {  
                this.entityList.splice(finalIdx, 1)
                this.entityList = this.level.get(move).entityList; //get entityList
                this.entityList.push(object)
                this.levelIdx = move;
                object.x = this.width - object.width; //if moved, then change x coordinates accordingly
                this.player.moving = false;
            }
        } else if (object.x + object.width > this.width) { 
            object.x = this.width - object.width;
            let move = this.level.get(this.levelIdx).right;
            if (move) {    //if right panel exists, move there
                this.entityList.splice(finalIdx, 1)
                this.entityList = this.level.get(move).entityList;
                this.entityList.push(object)
                this.levelIdx = move;
                object.x = 0;
                this.player.moving = false;
            }
        
        } else if (object.y < 0) { 
            object.y = 0; object.velocityY = 0; 
            let move = this.level.get(this.levelIdx).up;
            if (move) {  
                this.entityList.splice(finalIdx, 1)
                this.entityList = this.level.get(move).entityList;
                this.entityList.push(object)
                this.levelIdx = move;
                object.y = this.height - object.height;
                this.player.moving = false;
            }
        } else if (object.y + object.height > this.height) { 
            object.y = this.height - object.height;
            let move = this.level.get(this.levelIdx).down;
            if (move) {
                this.entityList.splice(finalIdx, 1)
                this.entityList = this.level.get(move).entityList;
                this.entityList.push(object)
                this.levelIdx = move;
                object.y = 0;
                this.player.moving = false;
            }
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
        }
        
        if (mainObject.y < object.y && mainObject.y + mainObject.height > object.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + mainObject.height;
            check = true;
        } else if (mainObject.y > object.y && object.y + object.height > mainObject.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + object.height;
            check = true;
        }

        if (check) {
            let playerInEntity;
            for (let entity of this.entityList) {
                if (entity === this.player) {
                    playerInEntity = entity;
                }
            }
            this.player.moving = false;
            playerInEntity.start = {};
            playerInEntity.moving = false;
        }
    }

    locationChecker(x, y, object) {
        console.log(x, y, object)
        return (object.x < x && object.x + object.width > x && object.y < y && object.y + object.height > y)
    }

    whatDidPlayerClick(x, y) {
        let walkCheck = true;
        for (let entity of this.entityList) {
            if (this.locationChecker(x, y, entity)) {
                //interact with item;
                this.player = entity;
                walkCheck = false;
            }
        }

        if (walkCheck) {
            this.clickMove(x, y);
        }
    }

    clickMainScreen(x, y) {
        let startButton;
        for (let entity of this.entityList) {
            if (entity.name === 'startButton') {
                startButton = entity;
            }
        }

        if (this.locationChecker(x, y, startButton)) {
            console.log("m")
            this.emitEvent('nextScene');
        }
    }

    update(level) {
        this.level = level;
        this.entityList = this.level.matrix.get(this.levelIdx).entityList;
        this.level.set(this.levelIdx, this.entityList);
        if (this.player) {
            this.entityListPositionUpdate();
            let playerInEntity;
            for (let entity of this.entityList) {
                if (entity === this.player) {
                    playerInEntity = entity;
                }
            }
            if (playerInEntity) {
                this.collideObject(playerInEntity)

            }
            for (let entity of this.entityList) {
                if (entity !== playerInEntity) {
                    if (playerInEntity) {
                        this.collisionCheck(playerInEntity, entity)

                    }
                }
            }
        }
        // if (this.player && this.moveLocation) {
        //     let playerInEntity;
        //     for (let entity of this.entityList) {
        //         if (entity === this.player) { playerInEntity = entity; }
        //     }
        //     if (this.player.moveIdx < this.moveLocation.length) {
        //         let coordinates = this.matrix.changeToCoordinates(this.moveLocation[this.player.moveIdx]);
        //         playerInEntity.x = coordinates.x;
        //         playerInEntity.y = coordinates.y;
        //         this.player.moveIdx += 1;
        //     } else {
        //         this.moveLocation = null;
        //         this.player.moveIdx = 0;
        //     }
        //     this.collideObject(playerInEntity);
        // }
    }

    entityListPositionUpdate() {
        if (this.player.moving) {
            if (!this.cameraState) {
                let playerInEntity;
                for (let entity of this.entityList) {
                    if (entity === this.player) {
                        playerInEntity = entity;
                    }
                }

                playerInEntity.x = playerInEntity.start.x + playerInEntity.direction.x * playerInEntity.currentSteps;
                playerInEntity.y = playerInEntity.start.y + playerInEntity.direction.y * playerInEntity.currentSteps;
                if (playerInEntity.currentSteps < playerInEntity.steps) {
                    playerInEntity.currentSteps += 1;
                } else {
                    playerInEntity.moving = false;
                    playerInEntity.start.x = null;
                    playerInEntity.start.y = null;
                }
            } else {
                for (let entity of this.entityList) {
                    if (entity !== this.player) {
                        entity.x = entity.start.x - entity.direction.x * entity.currentSteps;
                        entity.y = entity.start.y - entity.direction.y * entity.currentSteps;
                        if (entity.currentSteps < entity.steps) {
                            entity.currentSteps += 1;
                        } else {
                            this.player.moving = false;
                            entity.moving = false;
                            entity.start.x = null;
                            entity.start.y = null;
                        }
                    }
                }
            }
        } 

    }
    
    returnEntityLocations() {
        let final = {};
        for (let idx = 0; idx < this.entityList.length; idx++) {
            final[idx] = this.entityList[idx];
        }
        return final;
    }

    keyDown(direction, down) {
        if (down) {
            switch(direction) {
                case 'up': this.moveUp(); break;
                case 'down': this.moveDown(); break;
                case 'left': this.moveLeft(); break;
                case 'right': this.moveRight();
            }
        }
    }

    clickMove(x, y) {
        // if (this.player) {
        //     this.moveLocation = this.matrix.traverse(this.player.x, this.player.y, x, y);
        //     this.player.moveIdx = 0;
        // }
        if (this.player) {
            if (!this.cameraState) {
                let playerInEntity;
                for (let entity of this.entityList) {
                    if (entity === this.player) {
                        playerInEntity = entity;
                    }
                }

                playerInEntity.currentSteps = 1;
                playerInEntity.start = {};
                playerInEntity.start.x = playerInEntity.x;
                playerInEntity.start.y = playerInEntity.y;
                x -= playerInEntity.width / 2;
                y -= playerInEntity.height / 2;

                let xabs = Math.abs(x - playerInEntity.x);
                let yabs = Math.abs(y - playerInEntity.y);
                let length = Math.sqrt( Math.pow(xabs, 2) + Math.pow(yabs, 2));
                playerInEntity.steps = Math.floor(length) / 25;
                playerInEntity.moving = true;
                playerInEntity.direction = {};
                playerInEntity.steps = (!playerInEntity.steps) ? 0.1 : playerInEntity.steps;
                playerInEntity.direction.x = (x - playerInEntity.x) / playerInEntity.steps;
                playerInEntity.direction.y = (y - playerInEntity.y) / playerInEntity.steps;
            } else {
                for (let entity of this.entityList) {
                    let playerInEntity;
                    for (let entity of this.entityList) {
                        if (entity === this.player) {
                            playerInEntity = entity;
                        }
                    }
                    if (entity !== this.player) {
                        entity.currentSteps = 1;
                        entity.start = {}
                        entity.start.x = entity.x;
                        entity.start.y = entity.y;
                        let xchange = playerInEntity.x - x;
                        let ychange = playerInEntity.y - y;
                        x = entity.x + xchange + playerInEntity.width / 2;
                        y = entity.y + ychange + playerInEntity.height / 2;

                        let xabs = Math.abs(entity.start.x + x);
                        let yabs = Math.abs(entity.start.y + y);
                        let length = Math.sqrt( Math.pow(xabs, 2) + Math.pow(yabs, 2));
                        entity.steps = Math.floor(length) / 25;
                        entity.moving = true;
                        entity.direction = {};
                        entity.direction.x = (entity.x - x) / entity.steps;
                        entity.direction.y = (entity.y - y) / entity.steps;
                        playerInEntity.moving = true;
                    }
                }
            }
        }
    }



    // jumpUp() {
    //     if (!this.jumping) {
    //         this.jumping = true;
    //         this.velocityY -= this.jump;
    //     }
    // }

    moveLeft(x) { this.player.velocityX = x; }
    moveRight(x) { this.player.velocityX = x; }
    moveUp(x) { this.player.velocityY = x; }
    moveDown(x) { this.player.velocityY = x; }
}


module.exports = GameSpace;