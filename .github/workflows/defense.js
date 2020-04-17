class Defense {
    constructor(base) {
        this.base = base;
        this.currentDefense = base;
    }

    reduceDamage(x) {
        let ability = x;
        ability -= this.getDefense();
        if (ability < 0) { ability = 0; }
        return ability
    }

    setDefense(defense) {
        this.currentDefense += defense;
    }

    getDefense() {
        return this.currentDefense;
    }
}

module.exports = Defense;