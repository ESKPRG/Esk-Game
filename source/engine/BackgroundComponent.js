const Component = require('./Component.js');

class BackgroundComponent extends Component {
    constructor(id, x, y, layer, width, height, type, color) {
        super(id, x, y, layer, width, height, type, color, Component.BACKGROUND);
    }

    static mainMenu(entity) {
        return new BackgroundComponent(
            entity.id,
            entity.x,
            entity.y,
            0,
            entity.width, entity.height,
            Component.BLOCK,
            entity.image
        )
    }

    static schoolDistrict(entity) {
        return new BackgroundComponent(
            entity.id,
            entity.x, 
            entity.y,
            0,
            entity.width,
            entity.height,
            Component.IMAGE,
            entity.image
        )
    }

    static greekSchool(entity) {
        return new BackgroundComponent(
            entity.id,
            entity.x,
            entity.y,
            0,
            entity.width,
            entity.height,
            Component.IMAGE,
            entity.image
        )
    }
}

module.exports = BackgroundComponent;