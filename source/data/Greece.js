const Country = require('./Country.js');

class Greece extends Country {
    constructor(name, description, image, x, y, width, height, locationsMap, religion, wealth){
        super(name, description, image, x, y, width, height, locationsMap, religion, wealth);
    }

    static create(locationsMap) {
        return new Greece(
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