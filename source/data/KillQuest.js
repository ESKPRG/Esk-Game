const Quest = require('./Quest.js');

class KillQuest extends Quest {
    constructor(name, description, image, location, reward) {
        super(name, description, image, Quest.KILL, location, reward);

    }

    static kill(number, reward, enemy, description, location) {
        return new KillQuest(
            ("Kill", number, enemy),
            description,
            "",
            location,
            reward
        )
    }
}

module.exports = KillQuest;