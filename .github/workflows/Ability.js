class Ability {
    constructor(name, description, use, intention, special, damage, type, requirement, classType, cooldown, img) {
        this.name = name;
        this.description = description;
        this.use = use;
        this.intention = intention;
        this.special = special;
        this.damage = damage;
        this.type = type;
        this.requirement = requirement;
        this.classType = classType;
        this.cooldown = cooldown;
        this.img = img;
    }


    getDmg() {
        return this.damage
    }

    setDmg(damage) {
        console.log(damage)
        this.damage = damage;
    }
}

Ability.POSITIVE = 'positive';
Ability.NEGATIVE = 'negative';

Ability.MAGIC = 'magic';
Ability.PHYSICAL = 'physical';

Ability.FIGHTER = 'fighter';
Ability.SAMURAI = 'samurai';
Ability.MAGE = 'mage';

Ability.STRENGTH = 'strength';
Ability.AGILITY = 'agility';
Ability.CONSTITUTION = 'constitituon';

module.exports = Ability;