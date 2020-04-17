class Experience {
    constructor() {
        this.experience = 0;
        this.cap = 10000;
    }

    set xp(experience) {
        this.experience += experience;
        if (this.xp > this.cap) {
            this.experience = this.cap;
        }
    }

    get xp() {
        return this.experience;
    }
}

module.exports = Experience;