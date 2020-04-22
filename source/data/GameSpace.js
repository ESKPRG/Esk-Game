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
        // this.matrix = new Matrix(height, width, [
        //     {
        //         x: 500,
        //         y: 800,
        //         width: 500,
        //         height: 500
        //     }
        // ], 10)
        // this.matrix.createMap()
    }

    addCharacter(character) {
        this.entityList.push(character);
    }

    collideObject(object) {
        if (object.x < 0) { object.x = 0; object.velocityX = 0; }
        else if (object.x + object.width > this.width) { object.x = this.width - object.width; }
        if (object.y < 0) { object.y = 0; object.velocityY = 0; }
        else if (object.y + object.height > this.height) { object.y = this.height - object.height;  }
    }

    collisionCheck(mainObject, object) {
        if (mainObject.x < object.x && mainObject.x + mainObject.width > object.x && mainObject.y > object.y && mainObject.y < object.y + object.height) {
            mainObject.x = object.x - mainObject.width;
        } else if (mainObject.x > object.x && mainObject.x < object.x + object.width && mainObject.y > object.y && mainObject.y < object.y + object.height) {
            mainObject.x = object.x + object.width;
        } else if (mainObject.y < object.y && mainObject.y + mainObject.height > object.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + mainObject.height;
        } else if (mainObject.y > object.y && object.y + object.height > mainObject.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + object.height;
        }
    }

    locationChecker(x, y, object) {
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

    update() {
        if (this.player) {
            if (this.cameraState) {
                this.player.x = document.body.clientWidth / 2;
                this.player.y = document.body.clientHeight / 2;
            }
            this.entityListPositionUpdate();
            let playerInEntity;
            for (let entity of this.entityList) {
                if (entity === this.player) {
                    playerInEntity = entity;
                }
            }
            this.collideObject(playerInEntity)
            for (let entity of this.entityList) {
                if (entity !== playerInEntity) {
                    this.collisionCheck(playerInEntity, entity)
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
            let entity = this.entityList[idx];
            final[idx] = {
                id: entity.id,
                x: entity.x,
                y: entity.y
            }
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
                console.log(playerInEntity.steps)
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