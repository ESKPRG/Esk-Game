class Intelligence {
    constructor(base, baseMana) {
        this.base = base;
        this.currentIntelligence = base;
        this.baseMana = baseMana;
        this.currentMana = baseMana;
    }

    setInt(intelligence) {
        this.currentIntelligence = intelligence;
    }

    getInt() {
        return this.currentIntelligence;
    }

    set mana(mana) {
        this.currentMana += mana;
        if (this.mana > this.baseMana) {
            this.currentMana = this.baseMana;
        }
    }

    get mana() {
        return this.currentMana;
    }
}

module.exports = Intelligence;