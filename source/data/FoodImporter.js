const Food = require('./Food.js')

class FoodImporter {
    constructor() {
        this.level = 1;
        this.quantity = this.level * 3
        this.quality = 'COMMON'
        this.stock = []
    }

    importFood(type) {
        return Food[type]()
    }

    stockUp() {
        const foodList = FoodImporter[this.quality]

        while (this.stock.length < this.quantity) {
            let num = Math.floor(Math.random() * 2)
            let food = this.importFood(foodList[num])
            this.stock.push(food)
        }
    }

}

FoodImporter.COMMON = [
    'Apple',
    'Bread'
]

module.exports = FoodImporter
