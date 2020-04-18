class AbilityList {
    constructor(list) {
        this.list = list
    }


    returnSelf() {
        return this.list
    }

    returnRandomAbility() {
        return this.list[Math.floor(Math.random() * this.list.length)]
    }
}

module.exports = AbilityList;