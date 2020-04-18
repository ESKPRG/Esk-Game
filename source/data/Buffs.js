const Effects = require('./Effects.js')

class Buffs extends Effects {
    constructor(name, source, duration, kind, attached, affect) {
        super(name, Effects.POSITIVE, source, duration, kind, attached, affect)
    }

    static WellRested(source, character) {
        return new Buffs(
            "Well Rested", source, 12, Effects.PASSIVE,
            character,
            function() {
                if (this.durationCheck()) {
                    this.character.stats.setHp(this.character.stats.health.getHp() - 5);
                }
                if (this.kind === 'active') {
                    this.character.stats.setHp(this.character.stats.health.getHp() + 5);
                } else if (this.duration === 12) {
                    this.character.stats.setHp(this.character.stats.health.getHp() + 5)
                }
                this.duration -= 1;
            }
        )
    }
}

module.exports = Buffs