class Building {
    constructor(name, upgrades, state, npc, x, y) {
        this.level = 1
        this.name = name;
        this.upgrades = upgrades
        this.state = state
        this.npc = npc;
        this.x = x;
        this.y = y;
        this.width = 500;
        this.height = 300;
    }

    retrieveBuildingLocation() {
        let dict = {};
        dict[this.name] = [this.x, this.y, this.width, this.height];
        return dict;
    }

    retrieveNpc() {
        return this.npc;
    }

    open() {
        this.state = Building.OPEN;
    }

    
}

Building.OPEN = 'Active'
Building.CLOSED = 'Inactive'

module.exports = Building