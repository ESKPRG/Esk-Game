const S = require('./Strength.js');
const D = require('./Dexterity.js');
const E = require('./Endurance.js');
const I = require('./Intelligence.js');
const C = require('./Constitution.js');
const M = require('./Memory.js');
const W = require('./Wits.js');
const L = require('./Luck.js');
const F = require('./Faith.js');


class Stats {
    constructor(strength, dexterity, endurance, intelligence, constitution, memory, wits, luck, faith) {
        this.strength = strength;
        this.dexterity = dexterity;
        this.endurance = endurance;
        this.intelligence = intelligence;
        this.constitution = constitution;
        this.memory = memory;
        this.wits = wits;
        this.luck = luck;
        this.faith = faith;
    }

    static create(str, strM, dex, dexM, end, endM, int, intM, cons, consM, mem, memM, wits, witsM, luck, luckM, faith, faithM) {
        return new Stats(
            S.create(str, strM),
            D.create(dex, dexM),
            E.create(end, endM),
            I.create(int, intM),
            C.create(cons, consM),
            M.create(mem, memM),
            W.create(wits, witsM),
            L.create(luck, luckM),
            F.create(faith, faithM)
        )
    }

}

module.exports = Stats;