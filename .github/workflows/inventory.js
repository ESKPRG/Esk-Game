class Inventory {
    constructor() {
        this.list = []
        this.weight = 0;
    }

    add(item) {
        this.list.push(item)
    }

    take(item) {
        for (let piece in this.list) {
            if (item === this.list[piece]) {
                let final = this.list[piece];
                this.list.splice(piece, 1);
                return final;
            }
        }
    }
}

module.exports = Inventory;