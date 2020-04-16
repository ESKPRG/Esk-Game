class Component {
    constructor(id, x, y, z, width, height, type, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.type = type;
        this.color = color;
    }

    drawImage(ctx) {   
        if (this.type === 'image') {
            this.image = new Image();
            this.image.src = this.color;
            this.image.addEventListener('load', e => {
                console.log(e)
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            });
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    static block() {
        return new Component(
            1,
            500, 300,
            0,
            200,
            200,
            'block',
            'red'
        )
    }

    static background() {
        return new Component(
            1,
            0, 0,
            0,
            1600,
            900,
            'block',
            'white'
        )
    }

}

module.exports = Component;