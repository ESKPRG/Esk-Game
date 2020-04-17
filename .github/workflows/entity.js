class Entity {
    constructor(name, description, entityType) {
        this.id = Math.floor((Math.random() * 1000000));
        this.name = name;
        this.description = description;
        this.entityType = entityType;
    }
}

Entity.INTERACTABLE = 'interactable';
Entity.MISCELLANEOUS = 'miscellaneous';

module.exports = Entity;