const Items = require('./Items.js')

class Forge {
    constructor() {
        this.level = 1
        this.timeTaken = 5 - this.level
        this.quality = 'UNCOMMON'
    }

    levelUp() {
        console.log("The Forge has leveled up")
        this.level += 1
        this.timeTaken = 5 - this.level
    }

    qualityUp(quality) {
        this.quality = quality
    }
}

Forge.UNCOMMON = [
    'IronHelmet',
    'IronChestPlate',
    'IronArms',
    'IronPants',
    'IronShoes',
    'Dou',
    'Kusazuri',
    'Kabuto',
    'Kote'
]

module.exports = Forge