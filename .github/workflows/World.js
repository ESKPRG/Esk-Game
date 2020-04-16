class World {
    constructor(gravity, friction, home, height, width) {
        this.gravity = gravity;
        this.friction = friction;
        this.home = home;
        this.height = height;
        this.width = width;
        this.player = {
            velocityX: 0,
            velocityY: 0,
            x: 500,
            y: 300
        };
        
    }

    collideObject(object) {
        if (object.x < 0) { object.x = 0; object.velocityX = 0; }
        else if (object.x + object.width > this.width) { object.x = this.width - object.width; }
        if (object.y < 0) { object.y = 0; object.velocityY = 0; }
        else if (object.y + object.height > this.height) { object.y = this.height - object.height;  }
    }

    update() {
        this.player.velocityY += this.gravity;
        this.player.update();

        this.player.velocityX *= this.friction;
        this.player.velocityY *= this.friction;

        this.collideObject(this.player)
    }

    refresh(direction, down) {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    keyDown(direction, down) {

    }

    // jumpUp() {
    //     if (!this.jumping) {
    //         this.jumping = true;
    //         this.velocityY -= this.jump;
    //     }
    // }

    moveLeft() { this.velocityX -= 0.5; }
    moveRight() { this.velocityX += 0.5; }
}


module.exports = World;