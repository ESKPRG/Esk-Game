const Location = require('./Location.js');
const School = require('./School.js');
const ShoppingMall = require('./ShoppingMall.js');

class District extends Location {
    constructor(id, name, description, image, x, y, width, height, entityList, startPosition) {
        super(id, name, description, image, x, y, width, height, entityList, startPosition);
    }

    static create(locationsMap, name, width, height) {
        return new District(
            0,
            name,
            "", //description
            "", //image
            0, 0,
            width, height,
            locationsMap
        )
    }

    static centralDistrict() {
        return new District(
            0,
            "Central District",
            "The Main City Centre of Greece",
            "",
            0, 0,
            25000, 25000,
            [
                ShoppingMall.greeceMall()
            ],
            {
                x: 100,
                y: 100
            }
        )
    }

    static schoolDistrict() {
        return new District(
            0,
            "School District",
            "School District",
            "assets/ahego.jpg",
            0, 0,
            8000, 5000,
            [
                School.greekSchool()
            ],
            {
                x: 100,
                y: 100
            }
        )
    }
}

module.exports = District;