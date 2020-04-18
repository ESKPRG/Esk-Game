
class ArmorShelf {
    constructor() {
        this.level = 1
        this.shelf = []
        this.baseLength = 1
        this.length = this.level * 2 + this.baseLength
    }

    stockUp() {
    }

    addItem(item, price) {
        return [item, price]
    }

    moreStocks(amount) {
        this.baseLength += amount
        this.length = this.level * 2 + this.baseLength
    }

}

ArmorShelf.LevelOneArmorList = [
    'IronHelmet',
    'IronChestPlate',
    'Leggings',
    'Dou',
    'Geta',
    'IronArms'
]


module.exports = ArmorShelf