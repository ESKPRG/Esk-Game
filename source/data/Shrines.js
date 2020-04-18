class Shrines {
    constructor(war, love, peace, greed, labour, fee) {
        this.war = war
        this.love = love
        this.peace = peace
        this.greed = greed
        this.labour = labour
        this.fee = fee
    }

    cheaperFee(amount) {
        this.fee -= amount
    }

    visit(shrine) {
        return this[shrine].visit()
    }

    advocate(amount) {
        this.war.advocate(amount)
        this.love.advocate(amount)
        this.peace.advocate(amount)
        this.greed.advocate(amount)
        this.labour.advocate(amount)
    }
}

module.exports = Shrines