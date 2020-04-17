const npc = require('./npc.js');


class Character extends npc {
    constructor(name, description, stats, inventory, occupation, status, abilityList, team) {
        super(name, description, stats, inventory, occupation)
        this.status = status
        this.abilityList = abilityList;
        this.team = team;
    }

    useRandomAbility(enemyList) {
        let ability = this.abilityList.returnRandomAbility()
        let target = enemyList[Math.floor((Math.random() * enemyList.length))]
        ability.use(this, target)
    }

    getDamage() {
        return this.stats.getDamage()
    }

    getDefense() {
        return this.stats.getDefense();
    }

    getHealth() {
        return this.stats.getHealth();
    }

    getCurrentHealth() {
        return this.stats.getCurrentHealth();
    }

    takeHit(ability) {
        this.stats.takeHit(ability);
    }

    getSpeed() {
        return this.stats.getSpeed()
    }

    returnAbilityList() {
        return this.abilityList.returnSelf()
    }
}

Character.GOOD = 'good';
Character.EVIL = 'evil';

Character.KNIGHT = 'knight';
Character.GOBLIN = 'goblin';

module.exports = Character;