const Country = require('./Country.js');

class Italy extends Country {
    constructor(name, description, image, x, y, width, height, locationsMap, religion, wealth){
        super(name, description, image, x, y, width, height, locationsMap, religion, wealth);
    }

    static create(locationsMap) {
        return new Italy(
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