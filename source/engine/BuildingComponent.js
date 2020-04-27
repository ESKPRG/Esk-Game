const Component = require('./Component.js');

class BuildingComponent extends Component {
    constructor(id, x, y, layer, width, height, type, color) {
        super(id, x, y, layer, width, height, type, color, Component.BUILDING)
    }

    static greekSchool(entity){
        return new BuildingComponent(
            entity.id,
            entity.x,
            entity.y,
            1,
            entity.outsideWidth,
            entity.outsideHeight,
            Component.IMAGE,
            ""
        )
    }
}

module.exports = BuildingComponent;