const Country = require('./Country.js');

class Italy extends Country {
    constructor(id, name, description, image, x, y, width, height, locationsMap, religion, wealth){
        super(id, name, description, image, x, y, width, height, locationsMap, religion, wealth);
    }

    static create(locationsMap) {
        return new Italy(
            0,
            "Italy",
            "The country Italy",
            "",
            0, 0,
            0, 0,
            locationsMap,
            "Roman",
            Country.RICH
        )
    }
}

module.exports = Italy;