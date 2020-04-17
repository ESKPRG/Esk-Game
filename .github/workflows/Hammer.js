const Item = require('./Items.js')

class Hammer {
    constructor() {
        this.level = 1;
        this.repairPrice = 100 - this.level * 5
    }

    repairItem(item) {
        item.currentEndurance = item.maxEndurance
    }

    levelUp(amount) {
        this.level += amount
        this.repairPrice = 100 - this.level * 5
    }

    checkRepairPrice(itemMissingEndurance) {
        return this.repairPrice + itemMissingEndurance
    }
}

module.exports = Hammer