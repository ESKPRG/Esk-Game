const Npc = require('./Npc.js')


class QuestGiver extends Npc {
    constructor(name, favor, health, money, questList) {
        super(name, favor, health, money)
        this.questList = questList
    }
}

module.exports = QuestGiver