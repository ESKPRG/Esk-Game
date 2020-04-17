
class WeaponShelf {
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

WeaponShelf.LevelOneWeaponList = [
    'IronSword',
    'Katana',
    'Staff',
    'WoodenShield'
]

WeaponShelf.LevelOnePriceList = {
    'IronSword': 20,
    'Katana': 80,
    'Staff': 60,
    'WoodenShield': 50
}

module.exports = WeaponShelf