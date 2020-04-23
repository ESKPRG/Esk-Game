const Entity = require('./Entity.js');

class Quest extends Entity {
    constructor(id, name, description, image, type, location, reward) {
        super(id, name, description, image, 0, 0, 0, 0, Entity.QUEST);
        this.questType = type
        this.difficulty = difficulty
        this.location  = location
        this.reward = reward
    }
}

Quest.NOVICE = "★"
Quest.INTERMEDIET = "★★"
Quest.EXPERIENCED = "★★★"
Quest.MASTER = "★★★★"
Quest.LEGENDARY = "★★★★★"

Quest.STUDY = "study";
Quest.FIND = 'find';
Quest.KILL = 'kill';
Quest.TALK = 'talk';

module.exports = Quest