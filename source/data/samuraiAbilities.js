const ability = require('./Ability.js');
const debuff = require('./Debuffs.js')

class SamuraiAbilities extends ability {
    constructor(name, description, use, intention, special, damage, type, requirement, cooldown, img) {
        super(name, description, use, intention, special, damage, type, requirement, ability.SAMURAI, cooldown, img)
    }

    static createSlash() {
        return new SamuraiAbilities(
            "Slash",
            "A quick strike",
            function(user, target) {
                let damage = user.getDamage() + this.getDmg();
                target.takeHit(damage);
            },
            ability.NEGATIVE,
            debuff.bleeding(),
            8,
            ability.AGILITY,
            null,
            1,
            'assets/Basic attack-2.png'
        )
    }
}

module.exports = SamuraiAbilities;