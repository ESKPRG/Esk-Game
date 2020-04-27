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
    }

    drawImage(ctx) {
        if (this.type === 'block') {
            this.check = true;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height)

        } else if (this.type === 'image') {
            this.image = new Image();
            this.image.src = this.color;
            this.image.addEventListener('load', e => {
                ctx.drawImage(this.image, this.x - this.width/4, this.y - this.height/4, this.width, this.height);
            });

        } 
            
        if (this.text) {
            ctx.font = this.font;
            ctx.fillStyle = this.fillStyle;
            ctx.textAlign = this.textAlign;
            ctx.fillText(this.text, this.x, this.y);
            this.check = true;
        }
    }

    update(object) {
        let updateCheck = (this.x !== object.x || this.y !== object.y)
        this.x = object.x;
        this.y = object.y;
        this.width = object.width;
        this.height = object.height;
        return updateCheck;
    }
}

Component.IMAGE = 'image';
Component.BLOCK = 'block';
Component.TEXT = 'text';

Component.CHARACTER = 'character';
Component.ICON = 'icon';
Component.BUILDING = 'building';

module.exports = Component;