class Component {
    constructor(id, x, y, layer, width, height, type, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.layer = layer;
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

    update(location) {
        this.x = location.x;
        this.y = location.y;
    }

    static block() {
        return new Component(
            1,
            300, 300,
            1,
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
            2000,
            1000,
            'block',
            'white'
        )
    }

}

module.exports = Component;