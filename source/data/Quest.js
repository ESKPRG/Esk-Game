class Quest {
    constructor(name, type, difficulty, location, reward, description) {
        this.name = name
        this.type = type
        this.difficulty = difficulty
        this.location  = location
        this.reward = reward
        this.description = description
    }
}

Quest.Novice = "★"
Quest.Intermediate = "★★"
Quest.Experienced = "★★★"
Quest.Master = "★★★★"
Quest.Legendary = "★★★★★"

Quest.FARM = "Farming Quest"
Quest.HUNT = "Hunting Quest"
Quest.KILL = "Killing Quest"

module.exports = Quest