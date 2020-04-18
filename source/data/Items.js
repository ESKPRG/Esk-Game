const interactable = require('./interactable.js')

class Items extends interactable {
    constructor(name, description, stats, level, health, itemType, rarity, basePrice) {
        super(name, description, interactable.ITEM, stats, level, health)
        this.itemType = itemType
        this.rarity = rarity
        this.basePrice = basePrice
        this.currentPrice = this.basePrice + ((this.basePrice * 0.2) * this.level)
    }
}

Items.EQUIPABLE = 'equipable'
Items.POTION = 'potion'
Items.FOOD = 'food'
Items.INTERACTABLE = 'interactable'

Items.COMMON = 'common'
Items.UNCOMMON = 'uncommon'
Items.RARE = 'rare'
Items.EPIC = 'epic'
Items.LEGENDARY = 'legendary'
Items.SERAPH = 'seraph'
Items.PEARL = 'pearlescent'

module.exports = Items