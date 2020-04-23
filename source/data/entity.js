class Entity {
    constructor(id, name, description, image, x, y, width, height, entityType) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.entityType = entityType;
    }
}

Entity.INTERACTABLE = 'interactable';
Entity.MISCELLANEOUS = 'miscellaneous';
Entity.ICON = 'icon';
Entity.PLAIN = 'plain';
Entity.ATTRIBUTE = 'attribute';
Entity.QUEST = 'quest';
Entity.LOCATION = 'location';

module.exports = Entity;