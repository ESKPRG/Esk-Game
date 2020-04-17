const Quest = require('./Quest.js')

class KillQuests extends Quest {
    constructor(name, difficulty, location, reward, description) {
        super(name, Quest.KILL, difficulty, location, reward, description)
    }

    static killOutlaw() {
        return new KillQuests(
            "Kill 5 Outlaws",
            Quest.Novice,
            "Earth",
            200,
            "A group of Bandits were spotted lurking near the village recently, go and take them down!"
        )
    }
}

module.exports = KillQuests