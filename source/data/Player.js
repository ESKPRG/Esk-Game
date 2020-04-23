const QuestList = require('./QuestList.js');

class Player {
    constructor(id, name, gameState) {
        this.id = id;
        this.name = name;
        this.gameState = gameState;
        this.questList = new QuestList()
    }
}

module.exports = Player;