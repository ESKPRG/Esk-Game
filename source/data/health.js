class Health {
    constructor(base) {
        this.base = base;
        this.currentHealth = base;
    }

    setCurrentHealth(health) {
        this.currentHealth = health;
        if (this.currentHealth > this.base) {
            this.currentHealth = this.base;
        }
    }

    setHp(health) {
        this.base = health;
    }

    getHp(health) {
        this.base = health;
    }

    getCurrentHealth() {
        return this.currentHealth;
    }

    takeHit(ability) {
        console.log(ability, "Damage!")
        console.log(ability)
        this.setCurrentHealth(this.getCurrentHealth() - ability);
    }
}

module.exports = Health;