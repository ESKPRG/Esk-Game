class QuestList {
    constructor() {
        this.list = [];
        this.completedList = [];
        this.failedList = [];
    }

    add(quest) {
        this.list.push(quest);
    }

    failed(failedQuest) {
        let idx = 0;
        for (let quest of this.list) {
            if (failedQuest === quest) {
                this.failedList.push(this.list.splice(idx, 1));
            }
            idx += 1;
        }
    }

    completed(completedQuest) {
        let idx = 0;
        for (let quest of this.list) {
            if (completedQuest === quest) {
                this.completedList.push(this.list.splice(idx, 1))
            }
            idx += 1;
        }
    }
}

module.exports = QuestList