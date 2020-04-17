const Items = require('./Items.js')

class Food extends Items {
    constructor(rarity, name, heal, price, strength, agility, constitution, description) {
        super(Items.FOOD, rarity, name)
        this.heal = heal
        this.price = price
        this.strength = strength
        this.agility = agility
        this.constition = constitution
        this.description = description
    }

    returnPrice() {
        return this.price
    }

    static Apple() {
        return new Food(Items.COMMON, "Red Apple",
        5, 3,
        0, 0, 0,
        "A shiny red apple, there is a worm sticking out of it.")
    }

    static Bread() {
        return new Food(Items.COMMON, "Bread",
        5, 3,
        1, 0, 0,
        "Freshly baked bread~")
    }


}

module.exports = Food