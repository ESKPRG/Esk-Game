
class Anvil {
    constructor() {
        this.level = 1
        this.timeTaken = 5 - this.level
        this.quality = 'UNCOMMON'
    }

    levelUp() {
        console.log("The anvil has leveled up")
        this.level += 1
        this.timeTaken = 5 - this.level
    }

    qualityUp(quality) {
        this.quality = quality
    }
}

Anvil.UNCOMMON = [
    'Katana'
]

module.exports = Anvil