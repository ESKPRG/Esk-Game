class Effects {
    constructor(name, type, source, duration, kind, attached, affect) {
        this.name = name
        this.type = type
        this.source = source
        this.duration = duration
        this.kind = kind
        this.attached = attached;
        this.affect = affect
        this.attach = function(target) {
            target.addStatus(this);
        }
    }

    durationCheck() {
        if (this.duration === 0) {
            this.attached.removeEffect(this)
            return true
        }
    }

}

Effects.NEGATIVE = 'debuff'
Effects.POSITIVE = 'buff'

Effects.PASSIVE = 'passive'
Effects.ACTIVE = 'active'

module.exports = Effects