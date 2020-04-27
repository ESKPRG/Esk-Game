const Planet = require('./Planet.js');
const Greece = require('./Greece.js');
const Italy = require('./Italy.js')
const School = require('./School.js');
const District = require('./District');
const ShoppingMall = require('./ShoppingMall.js')
const Shop = require('./Shop.js')

class Earth extends Planet {
    constructor(countryList, name) {
        super(name, countryList)
    }

    static create() {
        return new Earth([
            Greece.create({
                "School District": District.schoolDistrict(),
                "Central District": District.centralDistrict()
            }),
            Italy.create({
                "School District": District.schoolDistrict(),
                "Central District": District.centralDistrict()
            })
        ],
        "Earth")
    }
}

module.exports = Earth