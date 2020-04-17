class UpgradeToken {
    constructor(upgrade, name, cost) {
        this.next = []
        this.upgrade = upgrade
        this.name = name
        this.cost = cost
        this.unlocked = false
    }

    hasNext(direction) {
        return this.next[direction]
    }

    connect(upgrade) {
        this.next.push(upgrade)
    }
}

module.exports = UpgradeToken