const Items = require('./Items.js')
const Buffs = require('./Buffs.js')
const Debuffs = require('./Debuffs.js')
const Effects = require('./Effects.js')

class Beds extends Items {
    constructor(rarity, name, effects, description) {
        super(Items.INTERACTABLE, rarity, name)
        this.effects = effects
    }

    sleep(characters) {
        for (let idx in characters.length) {
            console.log(characters.name,"Has slept for 8 hours")
            characters[idx].recieveEffect(this.effects)
        }
    }

    static woodenBed() {
        return new Beds(
            Items.COMMON, 
            "Wooden bed", Debuffs['backPain']("Wooden bed"),
            "Hard wooden bed, quite uncomfortable"
        )
    }

    static commonerBed() {
        return new Beds(
            Items.UNCOMMON,
            "Commoner's bed", null,
            "A bed for commoners, quite cheap"
        )
    }

    static sanctuaryPride() {
        return new Beds(
            Items.RARE,
            "Sanctuary's Pride", Buffs['WellRested']("Sanctuary's Pride"),
            "A bed for the heroes of Sanctuary"
        )
    }
}

module.exports = Beds