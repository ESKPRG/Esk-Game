class SceneHandler {
    constructor() {
        this.sceneList = []
        this.firstScene = null;
        this.currentScene = null;
        this.savedScene = null;
    }

    joinScenes(sceneList) {
        let firstScene = sceneList[0];
        this.sceneList.push(sceneList[0]);
        for (let idx = 0; idx < sceneList.length - 1; idx++) {
            sceneList[idx].connect(sceneList[idx+1]);
            this.sceneList.push(sceneList[idx+1]);
        }

        return firstScene;
    }

    setScene(scene) {
        this.currentScene = scene;
    }

    runScene() {
        console.log(this.currentScene)
        this.currentScene.run();
    }

    nextScene(choice = 0) {
        this.currentScene = this.currentScene.connectedScenes[choice];
        this.runScene();
    }

    addScene(scene) {
        if (!this.firstScene) {
            this.firstScene = scene;
            this.currentScene = this.firstScene;
        } else {
            this.sceneList.push(scene);
            this.currentScene.connect(scene);
        }
    }

    getLevel() {
        return this.currentScene.level;
    }
}

module.exports = SceneHandler;