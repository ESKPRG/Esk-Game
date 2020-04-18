const Effects = require('./Effects.js')

class Debuffs extends Effects {
    constructor(name, source, duration, kind, attached, affect) {
        super(name, Effects.NEGATIVE, source, duration, kind, attached, affect)
    }

    static onFire(source, character) {
        return new Debuffs(
            "On fire", source, 2, Effects.ACTIVE,
            character,
            function() {
                this.durationCheck();
                this.attached.stats.setHp(-5);
                this.duration -= 1;
            }
        )
    }

    static bleeding(source, character) {
        return new Debuffs(
            "Bleeding", source, 4, Effects.ACTIVE,
            character,
            function() {
                this.durationCheck();
                this.attached.stats.setHp(-5);
                this.duration -= 1;
            }
        )
    }


    static backPain(source, character) {
        return new Debuffs(
            "Back pain", source, 12, Effects.PASSIVE,
            character,
            function() {
                this.durationCheck();
                if (this.duration === 12) {
                    this.attached.stats.setHp(-10)
                }
                this.duration -= 1;
            }
        )
    }

    static fatigued(source, character) {
        return new Debuffs(
            "Fatigued", source, undefined, Effects.PASSIVE,
            character,
            function() {
                if (this.durationCheck()) {
                    this.attached.stats.setSpeed(5);
                }
                this.attached.stats.setSpeed(-5);
                this.duration -= 1;
            }
        )

    }

    static blurredVision(source, character) {
        return new Debuffs(
            "Blurred vision", source, 2, Effects.PASSIVE,
            character,
            function() {
                if (this.durationCheck()) {
                    this.attached.stats.setDamage(10);
                }
                if (this.duration === 2) {
                    this.attached.stats.setDamage(-10);
                }
                this.duration -= 1;
            }
        )
    }

    static ringingEars(source, character) {
        return new Debuffs(
            "Ringing ears", source, 2, Effects.PASSIVE,
            character,
            function() {
                if (this.durationCheck()) {
                    this.attached.stats.setInt(10);
                }
                this.attached.stats.setInt(-10);
                this.duration -= 1;
            }
        )
    }

    static internalBleeding(source, character) {
        return new Debuffs(
            "Internal bleeding", source, undefined, Effects.ACTIVE,
            character,
            function() {
                this.attached.stats.setDamage(-10);
                this.duration -= 1;
            }
        )
    }

}

module.exports = Debuffs