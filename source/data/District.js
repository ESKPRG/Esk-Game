const Location = require('./Location.js');

class District extends Location {
    constructor(name, description, image, x, y, width, height, locationsMap) {
        super(name, description, image, x, y, width, height, locationsMap);
    }

    static create(locationsMap, name) {
        return new District(
            name,
            "", //description
            "", //image
            0, 0,
            0, 0,
            locationsMap
        )
    }
}

module.exports = District;