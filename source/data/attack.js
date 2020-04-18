class Attack {
    constructor(base) {
        this.base = base;
        this.currentAttack = base;
    }

    setAtk(attack) {
        this.currentAttack = attack;
    }

    getAtk() {
        return this.currentAttack;
    }
}

module.exports = Attack;
