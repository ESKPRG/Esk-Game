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
                1: District.create({
                    1: School.greekSchool(),
                },
                "School district"),
                2: District.create({
                    1: ShoppingMall.create({
                        1: Shop.create(),
                        2: Shop.create()
                    })
                }, "Shopping district")
            }),
            Italy.create({
                1: District.create({
                    1: School.greekSchool(),
                },
                "School district"),
                2: District.create({
                    1: ShoppingMall.create({
                        1: Shop.create()
                    })
                }, "Shopping district")
            })
        ],
        "Earth")
    }
    
}

module.exports = Earth