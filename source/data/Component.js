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
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            });
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    update(object) {
        this.x = object.x;
        this.y = object.y;
    }

    static demiGod(character) {
        return new Component(
            character.id,
            character.x, character.y,
            character.id,
            character.width,
            character.height,
            'block',
            "red"
        )
    }
    static block(character) {
        return new Component(
            character.id,
            character.x,
            character.y,
            character.id,
            character.width,
            character.height,
            'block',
            'blue'
        )
    }


    static background() {
        return new Component(
            0,
            0, 0,
            0,
            document.body.clientWidth,
            document.body.clientHeight,
            'block',
            'white'
        )
    }

}

module.exports = Component;