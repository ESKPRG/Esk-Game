class Status {
    constructor() {
        this.buff = []
        this.debuff = []
    }

    applyEffect(effect) {
        this[effect.type].push(effect)
    }

    removeEffect(effect) {
        for (let x = 0; x < this[effect.type].length; x++) {
            if (this[effect.type][x].name === effect.name) {
                this[effect.type].splice(x);
                break;
            }
        }
    }


}

module.exports = Status