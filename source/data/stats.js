class Stats {
    constructor(attack, defense, health, intelligence, speed, experience) {
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.intelligence = intelligence;
        this.speed = speed;
        this.experience = experience;
    }

    getDamage() {
        return this.attack.getAtk();
    }

    setDamage(damage) {
        this.attack.setAtk(this.attack.getAtk() + damage);
    }

    getHealth() {
        return this.health.getHp();
    }

    getCurrentHealth() {
        return this.health.getCurrentHealth();
    }

    setHealth(health) {
        this.health.setHealth(this.health.getHealth() + health);
    }

    takeHit(ability) {
        ability = this.defense.reduceDamage(ability);
        this.health.takeHit(ability);
    }

    getDefense() {
        return this.defense.getDefense()
    }

    getIntelligence() {
        return this.intelligence.getInt();
    }

    setIntelligence(int) {
        this.intelligence.setInt(this.intelligence.getInt() + int);
    }

    getSpeed() {
        return this.speed.getSpeed()
    }

    setSpeed(speed) {
        this.speed.setSpeed(this.speed.getSpeed() + speed);
    }
}

module.exports = Stats;