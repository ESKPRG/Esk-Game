class Component {
    constructor(id, x, y, layer, width, height, type, color, componentType) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.width = width;
        this.height = height;
        this.type = type;
        this.color = color;
        this.componentType = componentType;
        this.check = true;
    }

    drawImage(ctx) {  
        if (!this.check) {
            if (this.color) {
                // this.image = new Image();
                // this.image.src = this.color;
                // this.image.addEventListener('load', e => {
                //     ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                // });

                this.check = true;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height)
            }
            if (this.text) {
                ctx.font = this.font;
                ctx.fillStyle = "white";
                ctx.textAlign = this.textAlign;
                ctx.fillText(this.text, this.x, this.y);
                this.check = true;
            }
        }
    }

    update(object) {
        this.x = object.x;
        this.y = object.y;
        this.check = false;
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
            'black'
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

Component.IMAGE = 'image';
Component.BLOCK = 'block';
Component.TEXT = 'text';

module.exports = Component;