class WorshipSpot {
    constructor(god, type, level) {
        this.god = god
        this.type = type
        this.level = level
    }

    visit() {
        return this.god.blessing() 
    }

    warAction(amount) {
        this.god.warAction(amount)
    }

    peaceAction(amount) {
        this.god.peaceAction(amount)
    }

    loveAction(amount) {
        this.god.loveAction(amount)
    }

    labourAction(amount) {
        this.god.labourAction(amount)
    }

    greedAction(amount) {
        this.god.greedAction(amount)
    }

    advocate(amount) {
        if (amount < 0) {
            this.god.negative(amount)
        } else {
            this.god.postive(amount)
        }
    }
}

WorshipSpot.WAR = 'war'
WorshipSpot.LOVE = 'love'
WorshipSpot.PEACE = 'peace'
WorshipSpot.GREED = 'greed'
WorshipSpot.LABOUR = 'labour'




module.exports = WorshipSpot