const Country = require('./Country.js');

class Greece extends Country {
    constructor(id, name, description, image, x, y, width, height, locationsMap, religion, wealth){
        super(id, name, description, image, x, y, width, height, locationsMap, religion, wealth);
    }

    static create(locationsMap) {
        return new Greece(
            0,
            "Greece",
            "The country Greece",
            "",
            0, 0,
            0, 0,
            locationsMap,
            "Greek",
            Country.RICH
        )
    }
}

module.exports = Greece;