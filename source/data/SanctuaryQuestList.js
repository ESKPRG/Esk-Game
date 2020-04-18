const QuestList = require('./QuestList.js')
const Kill = require('./KillQuests.js')
const Hunt = undefined
const Farm = require('./FarmQuests.js')

class SanctuaryQuestList extends QuestList {
    constructor() {
        super(
            [
            Farm['gatherHerbs'](),
            Kill['killOutlaw']()
            ],
            [],
            [],
            [],
            [])
    }
}

module.exports = SanctuaryQuestList