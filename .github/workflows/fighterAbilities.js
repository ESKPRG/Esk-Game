const ability = require('./Ability.js');

class FighterAbilities extends ability {
    constructor(name, description, use, intention, special, damage, type, requirement, cooldown, img) {
        super(name, description, use, intention, special, damage, type, requirement, ability.FIGHTER, cooldown, img)
    }

    static createBash() {
        return new FighterAbilities(
            "Bash",
            "A basic strike",
            function(user, target) {
                let damage = user.getDamage() + this.getDmg();
                target.takeHit(damage);
            },
            ability.POSITIVE,
            null,
            10,
            ability.STRENGTH,
            null,
            2,
            'assets/Basic attack-1.png'
        )
    }
}

module.exports = FighterAbilities;