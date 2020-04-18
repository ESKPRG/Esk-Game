class World {
    constructor(gravity, friction, home, height, width) {
        this.gravity = gravity;
        this.friction = friction;
        this.home = home;
        this.height = height;
        this.width = width;
        this.player = {
            character: null,
            velocityX: 0,
            velocityY: 0,
            movingX: null,
            movingY: null,
            x: 500,
            y: 300,
            direction: {
                x: null,
                y: null
            },
            start: {
                x: null,
                y: null
            },
            width: 200,
            height: 200,
            steps: null,
            currentSteps: 1,
            moving: false
        };
        
    }

    collideObject(object) {
        if (object.x < 0) { object.x = 0; object.velocityX = 0; }
        else if (object.x + object.width > this.width) { object.x = this.width - object.width; }
        if (object.y < 0) { object.y = 0; object.velocityY = 0; }
        else if (object.y + object.height > this.height) { object.y = this.height - object.height;  }
    }

    update() {
        // this.player.velocityX *= this.friction;
        // this.player.velocityY *= this.friction;
        this.playerUpdate()
        this.collideObject(this.player)
    }

    playerUpdate() {
        // this.player.x += this.player.velocityX;
        // this.player.y += this.player.velocityY;
        // console.log(this.player.x, this.player.y, this.player.movingX, this.player.movingY)
        // if (this.player.x === this.player.movingX || this.player.y === this.player.movingY) {
        //     console.log("o")
        //     this.player.movingY = null;
        //     this.player.movingX = null;
        //     this.player.velocityX = 0;
        //     this.player.velocityY = 0;
        // }
        if (this.player.moving) {
            console.log(this.player.x, this.player.start.x, this.player.currentSteps, this.player.direction.x)
            this.player.x = this.player.start.x + this.player.direction.x * this.player.currentSteps;
            this.player.y = this.player.start.y + this.player.direction.y *this.player.currentSteps;
            if (this.player.currentSteps < this.player.steps) {
                this.player.currentSteps += 1;
            } else {
                this.player.moving = false;
                this.player.start.x = null;
                this.player.start.y = null;
            }
        }
        
    }
    
    returnEntityLocations() {
        return {
            x: this.player.x,
            y: this.player.y
        }
    }

    keyDown(direction, down) {
        if (down) {
            switch(direction) {
                case 'up': this.moveUp(); break;
                case 'down': this.moveDown(); break;
                case 'left': this.moveLeft(); break;
                case 'right': this.moveRight();
            }
            this.playerUpdate()
        }
    }

    clickMove(x, y) {
        this.player.currentSteps = 1;
        this.player.start.x = this.player.x;
        this.player.start.y = this.player.y;
        x -= 720 - this.player.width / 2;
        y -= 257 + this.player.height /2;

        let xabs = Math.abs(x - this.player.x);
        let yabs = Math.abs(y - this.player.y);
        let length = Math.sqrt( Math.pow(xabs, 2) + Math.pow(yabs, 2));
        this.player.steps = Math.floor(length) / 25;
        this.player.moving = true;
        this.player.direction.x = (x - this.player.x) / this.player.steps;
        this.player.direction.y = (y - this.player.y) / this.player.steps;
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


module.exports = World;