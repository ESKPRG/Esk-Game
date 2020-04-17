const Quest = require('./Quest.js')

class FarmQuests extends Quest {
    constructor(name, difficulty, location, reward, description) {
        super(name, Quest.FARM, difficulty, location, reward, description)
    }

    static gatherHerbs() {
        return new FarmQuests(
            "Gather 10 Herbs",
            Quest.Novice,
            "Earth",
            100,
            "The village doctor needs some extra supplies, more precisely herbs. Go and collect some."
        )
    }
}

module.exports = FarmQuests